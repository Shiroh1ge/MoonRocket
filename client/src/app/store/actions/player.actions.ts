import { Injectable } from '@angular/core';
import { createAction, props, Store } from '@ngrx/store';
import { Player } from '../../models/player.model';
import { GlobalState } from '../store';

const getPlayer = createAction(
    'GET_PLAYER',
    props<{ payload: {userId: string} }>()
);

const getPlayerSuccess = createAction(
    'GET_PLAYER_SUCCESS',
    props<{ payload: Player }>()
);

const updatePlayer = createAction(
    'UPDATE_PLAYER',
    props<{ payload: Partial<Player> }>()
);


@Injectable({ providedIn: 'root' })
export class PlayerActions {
    public static getPlayer = getPlayer;
    public static getPlayerSuccess = getPlayerSuccess;
    public static updatePlayer = updatePlayer;

    constructor(private store: Store<GlobalState>) {

    }

    public getPlayerDispatch(playerData: {userId: string}) {
        return this.store.dispatch(PlayerActions.getPlayer({ payload: playerData }));
    }

    public getPlayerSuccessDispatch(player: Player) {
        return this.store.dispatch(PlayerActions.getPlayerSuccess({ payload: player }));
    }

    public updatePlayerDispatch(userData: Partial<Player>) {
        return this.store.dispatch(PlayerActions.updatePlayer({ payload: userData }));
    }
}


