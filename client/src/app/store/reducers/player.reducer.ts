import { Action, createReducer, createSelector, on } from '@ngrx/store';
import { Player } from '../../models/player.model';
import { PlayerActions } from '../actions/player.actions';
import { GlobalState } from '../store';

export interface PlayerState {
    player: Player;
}

export const playerInitialState: PlayerState = {
    player: {} as Player
};

const reducer = createReducer(
    playerInitialState,
    on(PlayerActions.getPlayerSuccess, (state, { payload }): PlayerState => ({
        ...state,
        player: payload
    })),
    on(PlayerActions.updatePlayer, (state, { payload }): PlayerState => ({
        ...state,
        player: {
            ...state.player,
            ...payload
        }
    }))
);


export function playerReducer(state: PlayerState | undefined, action: Action) {
    return reducer(state, action);
}

const getPlayer = (state: GlobalState) => state.player.player;

export const playerSelector = createSelector([getPlayer], player => player);


