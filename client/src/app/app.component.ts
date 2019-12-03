import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSort, MatTableDataSource } from '@angular/material';
import { interval, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ErrorCodes } from '../constants/error-codes';
import { SocketEvents, SocketRooms } from '../constants/socket-events';
import { SocketService } from './core/services/socket.service';
import { Launch } from './models/launch.model';
import { Movement } from './models/movement.model';
import { Player } from './models/player.model';
import { ServiceError } from './models/service-error.model';
import { PlayerActions } from './store/player.actions';
import { PlayerSelectors } from './store/player.selectors';

interface PlayerBet {
    altitude: number;
    amount: number;
    playerId: number;
    userId: string;
    gain?: number;
}

enum FlyAnimationState {
    DOWN = 'down',
    UP = 'up',
    EXPLODE = 'explode',
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    animations: [
        trigger('flyUp', [
            state(FlyAnimationState.DOWN, style({ bottom: '0' })),
            state(FlyAnimationState.UP, style({ bottom: '40vh' })),
            state(FlyAnimationState.EXPLODE, style({ opacity: 0, transform: 'scale(5) rotate(30deg)' })),
            transition(`${FlyAnimationState.DOWN} => ${FlyAnimationState.UP}`, animate('2s ease-in-out')),
            transition(`${FlyAnimationState.UP} => ${FlyAnimationState.DOWN}`, animate('2s ease-in-out')),
            transition(`${FlyAnimationState.UP} => ${FlyAnimationState.EXPLODE}`, animate('500ms ease-in-out'))
        ])
    ]
})
export class AppComponent implements OnInit {
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    private maximumAltitude: number = 100;
    public startingValue: number = 1;
    public player: Player;
    public amount = new FormControl(null, { validators: [Validators.required] });
    public altitude = new FormControl(null, { validators: [Validators.required] });
    public form: FormGroup;
    public betAltitude: number = 0;
    public newLaunchCountdownSeconds: number;
    public playerBets: PlayerBet[] = [];
    public displayedColumns = ['userId', 'amount', 'altitude', 'gain'];
    public launch: Launch | null;
    public flyAnimationState: FlyAnimationState = FlyAnimationState.DOWN;
    public FlyAnimationState = FlyAnimationState;
    public error: ServiceError | null;
    public movementPlayerIdMap: { [playerId: string]: Movement } = {};
    public resultAltitude: number = 0;
    public dataSource = new MatTableDataSource<PlayerBet>();

    constructor(private socketService: SocketService,
                private playerActions: PlayerActions,
                private formBuilder: FormBuilder,
                private playersSelectors: PlayerSelectors) {
    }


    private getLaunchDuration(altitude) {
        const minimumDuration = 4000;
        return minimumDuration + (altitude / 10 * 1000);
    }


    private resetLaunchData() {
        this.launch = null;
        this.error = null;
        this.movementPlayerIdMap = {};
        this.resultAltitude = 0;
    }

    public submitForm(values) {
        const data: PlayerBet = {
            altitude: values.altitude,
            amount: values.amount,
            userId: this.player.userId,
            playerId: this.player.id
        };

        this.socketService.emit(SocketEvents.bet, data);
        this.betAltitude = data.altitude;
    }

    ngOnInit() {
        this.dataSource.sort = this.sort;

        this.socketService.on(SocketEvents.playerConnected)
            .subscribe((socketData: { id: string }) => {
                setTimeout(() => {
                    this.socketService.emit(SocketEvents.getPlayer, { userId: socketData.id });
                    this.socketService.joinRoom(SocketRooms.launches);
                });

            });
        this.socketService.on(SocketEvents.getPlayer)
            .subscribe((player: Player) => {
                this.playerActions.getPlayerSuccessDispatch(player);
            });
        this.socketService.on(SocketEvents.newBets)
            .subscribe((data: { playerBets: PlayerBet[] }) => {
                this.resetLaunchData();
                this.dataSource.data = data.playerBets;
            });

        this.socketService.on(SocketEvents.launchInitiated)
            .subscribe(({ launch, launchDuration, movementPlayerIdMap }:
                            {
                                launch: Launch;
                                launchDuration: number;
                                movementPlayerIdMap: { [playerId: string]: Movement }
                            }) => {
                this.flyAnimationState = FlyAnimationState.UP;
                const timer$ = timer(launchDuration); // time in ms

                const animationInterval = 50;
                let accumulator = launchDuration / animationInterval;

                const animation$ = interval(animationInterval)
                    .pipe(
                        takeUntil(timer$)
                    )
                    .subscribe(val => {
                            accumulator += animationInterval;
                            const progress = accumulator / launchDuration;
                            const currentAltitude = progress * launch.altitude;

                            if (currentAltitude >= launch.altitude) {
                                this.resultAltitude = launch.altitude;
                            } else {
                                this.resultAltitude = currentAltitude;
                            }

                            this.playerBets.forEach(playerBet => {
                                if (playerBet.altitude >= this.resultAltitude) {
                                    this.movementPlayerIdMap[playerBet.playerId] = movementPlayerIdMap[playerBet.playerId];
                                }
                            });

                            console.log('res', this.resultAltitude);

                        },
                        () => {
                        },
                        () => {
                            this.resultAltitude = launch.altitude;
                        }
                    );
            });
        this.socketService.on(SocketEvents.launchCompleted)
            .subscribe(({ movementPlayerIdMap }: { movementPlayerIdMap: { [playerId: string]: Movement } }) => {
                this.movementPlayerIdMap = movementPlayerIdMap;
                this.flyAnimationState = FlyAnimationState.EXPLODE;

                setTimeout(() => {
                    this.flyAnimationState = FlyAnimationState.DOWN;
                }, 2000);

                if (movementPlayerIdMap[this.player.id]) {
                    this.playerActions.updatePlayerDispatch({
                        balance: this.player.balance + movementPlayerIdMap[this.player.id].gain
                    });

                    if (this.amount.value > this.player.balance) {
                        this.amount.patchValue(this.player.balance);
                    }
                }

            });
        this.socketService.on(SocketEvents.newLaunchCountdown)
            .subscribe((countDownSeconds) => {
                this.newLaunchCountdownSeconds = countDownSeconds;
            });
        this.socketService.on(SocketEvents.error)
            .subscribe((error: ServiceError) => {
                if (error.errorCode === ErrorCodes.unsuccessfulLaunch) {
                    this.resetLaunchData();
                    this.flyAnimationState = FlyAnimationState.DOWN;
                    this.error = error;
                }
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
