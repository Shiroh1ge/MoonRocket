import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SocketEvents } from '../constants/socket-events';
import { SocketService } from './core/services/socket.service';
import { Player } from './models/player.model';
import { PlayerActions } from './store/player.actions';
import { PlayerSelectors } from './store/player.selectors';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    private maximumAltitude: number = 1000;
    public startingValue: number = 1;
    public player: Player;
    public amount = new FormControl(null, { validators: [Validators.required] });
    public altitude = new FormControl(null, { validators: [Validators.required] });
    public form: FormGroup;
    public newLaunchCountdownSeconds: number;

    constructor(private socketService: SocketService,
                private playerActions: PlayerActions,
                private formBuilder: FormBuilder,
                private playersSelectors: PlayerSelectors) {
    }

    public submitForm(values) {
        const data = {
            altitude: values.altitude,
            amount: values.amount,
            userId: this.player.userId,
            playerId: this.player.id
        };

        this.socketService.emit(SocketEvents.bet, data);

    }

    ngOnInit() {
        this.socketService.on(SocketEvents.connected)
            .subscribe((socketData: { id: string }) => {
                this.socketService.emit(SocketEvents.getPlayer, { userId: socketData.id });
            });
        this.socketService.on(SocketEvents.getPlayer)
            .subscribe((player: Player) => {
                this.playerActions.getPlayerSuccessDispatch(player);
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
