import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Player } from '../models/player.model';
import { GlobalState } from '../store';
import { playerSelector } from './player.reducer';

@Injectable({ providedIn: 'root' })
export class PlayerSelectors {
    public player$: Observable<Player>;

    constructor(store: Store<GlobalState>) {
        this.player$ = store.pipe(select(playerSelector));
    }
}


