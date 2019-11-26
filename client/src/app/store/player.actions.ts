import { Injectable } from '@angular/core';
import { createAction, props, Store } from '@ngrx/store';
import { Player } from '../models/player.model';
import { GlobalState } from '../store';

const setPlayer = createAction(
    'SET_PLAYER',
    props<{ payload: Player }>()
);

const updatePlayer = createAction(
    'UPDATE_PLAYER',
    props<{ payload: Partial<Player> }>()
);


@Injectable({ providedIn: 'root' })
export class PlayerActions {
    public static setPlayer = setPlayer;
    public static updatePlayer = updatePlayer;

    constructor(private store: Store<GlobalState>) {

    }

    public setPlayerDispatch(userData: Player) {
        return this.store.dispatch(PlayerActions.setPlayer({ payload: userData }));
    }

    public updatePlayerDispatch(userData: Partial<Player>) {
        return this.store.dispatch(PlayerActions.updatePlayer({ payload: userData }));
    }
}


