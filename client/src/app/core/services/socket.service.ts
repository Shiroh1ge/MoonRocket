import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';

import * as io from 'socket.io-client';
import { SocketEvents } from '../../../constants/socket-events';
import { environment } from '../../../environments/environment';


@Injectable()
export class SocketService {
    private rooms: Set<string> = new Set();
    private reconnectionInterval;
    public socket: SocketIOClient.Socket | any;
    public isConnected: boolean = false;
    public isReconnecting: boolean = false;

    constructor() {
        this.connect();
    }

    /**
     * Established a new socket connection.
     */
    public connect() {
        if (this.socket && this.isConnected) {
            this.disconnect();
        }
        this.socket = null;
        this.socket = io(environment.socketRoot);
        this.socket.on('connected', () => {
            console.log('Socket has connected');

            this.isConnected = true;
            this.isReconnecting = false;
            clearInterval(this.reconnectionInterval);
            if (this.rooms) {
                this.rooms.forEach(room => this.joinRoom(room));
            }
        });
        this.socket.on('disconnect', (reason) => {
            this.isConnected = false;
            this.isReconnecting = true;

            this.reconnectionInterval = setInterval(() => {
                this.socket.connect();
            }, 1000);
        });
    }

    /**
     * Disconnects the current socket connection.
     */
    public disconnect() {
        this.socket.off('connected');
        this.socket.off('connect');
        this.socket.off('disconnect');
        this.socket.disconnect(true);
    }

    /**
     * Dispatches a socket event to the server.
     * @param event
     * @param data
     */
    public emit(event: string, data?: any) {
        this.socket.emit(event, data);
    }

    /**
     * Binds a request handler to a socket event.
     * @param event
     */
    public on(event: string): Observable<any> {
        return new Observable(observer => {
            this.socket.on(event, (data) => {
                observer.next(data);
            });
        }).pipe(share());
    }

    /**
     * Enters the provided room.
     * @param room
     */
    public joinRoom(room: string) {
        if (!this.rooms.has(room)) {
            this.rooms.add(room);
        }

        this.emit(SocketEvents.joinRoom, room);
    }

    /**
     * Leaves the provided room.
     * @param room
     */
    public leaveRoom(room: string) {
        if (this.rooms.has(room)) {
            this.rooms.delete(room);
        }

        this.emit(SocketEvents.leaveRoom, room);
    }

    /**
     * Removed a socket handler from an event.
     * @param event
     * @param handler
     */
    public removeListener(event: string, handler: () => {}) {
        this.socket.removeListener(event, handler);
    }
}
