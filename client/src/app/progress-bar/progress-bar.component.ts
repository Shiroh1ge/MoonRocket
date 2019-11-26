import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-progress-bar',
    templateUrl: './progress-bar.component.html',
    styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit {
    @Input() value: number = 0;
    @Input() max: number = 100;

    constructor() {
    }

    ngOnInit() {
    }


    getProgress() {
        if (this.max === 0) {
            return 0;
        }

        return Math.round(this.value / this.max * 100);
    }

}
