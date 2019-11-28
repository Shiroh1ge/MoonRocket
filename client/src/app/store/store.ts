import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '../../environments/environment';
import { playerReducer, PlayerState } from './player.reducer';

export interface GlobalState {
    player: PlayerState;
}

export const reducers: ActionReducerMap<GlobalState> = {
    player: playerReducer
};


export const metaReducers: MetaReducer<GlobalState>[] = !environment.production ? [] : [];
