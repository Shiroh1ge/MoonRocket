import { Movement } from './movement.model';

export interface Player {
    id: string;
    Movement: Movement;
    userId: string;
}
