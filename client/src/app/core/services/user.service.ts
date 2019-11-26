import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class UserService {
    private player = {};

    constructor(private http: HttpClient) {
    }

    public updateUser() {

    }
}
