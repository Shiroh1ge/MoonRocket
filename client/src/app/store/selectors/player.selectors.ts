import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Player } from '../../models/player.model';
import { playerSelector } from '../reducers/player.reducer';
import { GlobalState } from '../store';

@Injectable({ providedIn: 'root' })
export class PlayerSelectors {
    public player$: Observable<Player>;

    constructor(store: Store<GlobalState>) {
        this.player$ = store.pipe(select(playerSelector));
    }
}


