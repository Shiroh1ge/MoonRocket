import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SocketEvents, SocketRooms } from '../constants/socket-events';
import { SocketService } from './core/services/socket.service';
import { Launch } from './models/launch.model';
import { Movement } from './models/movement.model';
import { Player } from './models/player.model';
import { PlayerActions } from './store/player.actions';
import { PlayerSelectors } from './store/player.selectors';

interface PlayerBet {
    altitude: number;
    amount: number;
    playerId: number;
    userId: string;
}

enum FlyAnimationState {
    DOWN = 'down',
    UP = 'up'
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    animations: [
        trigger('flyUp', [
            state(FlyAnimationState.DOWN, style({ bottom: '0' })),
            state(FlyAnimationState.UP, style({ bottom: '40vh' })),
            transition(`${FlyAnimationState.DOWN} => ${FlyAnimationState.UP}`, animate('2s ease-in-out')),
            transition(`${FlyAnimationState.UP} => ${FlyAnimationState.DOWN}`, animate('2s ease-in-out'))
        ])
    ]
})
export class AppComponent implements OnInit {
    private maximumAltitude: number = 1000;
    public startingValue: number = 1;
    public player: Player;
    public amount = new FormControl(null, { validators: [Validators.required] });
    public altitude = new FormControl(null, { validators: [Validators.required] });
    public form: FormGroup;
    public newLaunchCountdownSeconds: number;
    public playerBets: PlayerBet[] = [];
    public displayedColumns = ['userId', 'amount', 'altitude', 'isWinner'];
    public launch: Launch | null;
    public flyAnimationState: FlyAnimationState = FlyAnimationState.DOWN;
    public FlyAnimationState = FlyAnimationState;

    constructor(private socketService: SocketService,
                private playerActions: PlayerActions,
                private formBuilder: FormBuilder,
                private playersSelectors: PlayerSelectors) {
    }

    public submitForm(values) {
        const data: PlayerBet = {
            altitude: values.altitude,
            amount: values.amount,
            userId: this.player.userId,
            playerId: this.player.id
        };

        this.socketService.emit(SocketEvents.bet, data);
        this.flyAnimationState = FlyAnimationState.UP;

    }

    ngOnInit() {
        this.socketService.on(SocketEvents.connected)
            .subscribe((socketData: { id: string }) => {
                this.socketService.emit(SocketEvents.getPlayer, { userId: socketData.id });

                setTimeout(() => {
                    this.socketService.joinRoom(SocketRooms.user + socketData.id);
                }, 250);
            });
        this.socketService.on(SocketEvents.getPlayer)
            .subscribe((player: Player) => {
                this.playerActions.getPlayerSuccessDispatch(player);
            });
        this.socketService.on(SocketEvents.newLaunch)
            .subscribe((data: { launch: Launch, playerBets: PlayerBet[], currentPlayerMovement: Movement }) => {
                this.playerBets = data.playerBets;
                this.launch = data.launch;
                this.playerActions.updatePlayerDispatch({
                    balance: this.player.balance + data.currentPlayerMovement.gain
                });
            });
        this.socketService.on(SocketEvents.newLaunchCountdown)
            .subscribe((countDownSeconds) => {
                this.newLaunchCountdownSeconds = countDownSeconds;
            });

        this.playersSelectors.player$
            .subscribe(player => {
                this.player = player;
            });

        this.form = this.formBuilder.group({
            altitude: this.altitude,
            amount: this.amount
        });

        this.amount.valueChanges.subscribe(value => {
            if (value > this.player.balance) {
                this.amount.patchValue(this.player.balance);
            }
        });

        this.altitude.valueChanges.subscribe(value => {
            if (value > this.maximumAltitude) {
                this.altitude.patchValue(this.maximumAltitude);
            }

            if (value === 0) {
                this.altitude.patchValue(1);
            }
        });
    }
}
