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
    public startingValue: number = 1;
    public player: Player;
    public amount = new FormControl(0, { validators: [Validators.required] });
    public altitude = new FormControl(0, { validators: [Validators.required] });
    public form: FormGroup;

    constructor(private socketService: SocketService,
                private playerActions: PlayerActions,
                private formBuilder: FormBuilder,
                private playersSelectors: PlayerSelectors) {
    }

    public submitForm(values) {
        console.log(values);
        const data = {};

        this.socketService.emit(SocketEvents.bid, data);

    }

    ngOnInit() {
        this.socketService.on(SocketEvents.connected)
            .subscribe((socketData: { id: string }) => {

                this.playerActions.updatePlayerDispatch({ id: socketData.id });
            });

        this.playersSelectors.player$
            .subscribe(player => {
                this.player = player;
            });

        this.form = this.formBuilder.group({
            altitude: this.altitude,
            amount: this.amount
        });
    }
}
