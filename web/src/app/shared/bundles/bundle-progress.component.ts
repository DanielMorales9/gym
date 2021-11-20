import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {Bundle, BundleSpecification} from '../model';

@Component({
    selector: 'bundle-progress',
    styleUrls: ['../../styles/root.css'],
    template: `
        <div style="margin-right: 16px; margin-top: 8px" *ngIf="percentage > 0">
            <ngb-progressbar [type]="percentageText"
                             [value]="percentage">{{percentageText}}
            </ngb-progressbar>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BundleProgressComponent implements OnInit {

    @Input() bundle: Bundle;

    percentage = 0;
    percentageText = '';
    percentageType = 'warning';

    constructor(private cdr: ChangeDetectorRef) {}

    ngOnInit(): void {

        const intSub = setInterval(() => {

            if (!this.bundle || !this.bundle.option) {
                return;
            }

            this.percentage = this.bundle.progress();

            // if (this.bundle.option.type === 'B') {
            //     this.percentage = this.bundle.progress();
            // } else if (!!this.bundle.startTime && !!this.bundle.endTime) {
            //     const start = new Date(this.bundle.startTime).getTime();
            //     const end = new Date(this.bundle.endTime).getTime();
            //     const now = new Date().getTime();
            //     this.percentage = (now - start) / (end - start);
            // } else {
            //     this.percentage = 0;
            // }

            this.percentage = this.percentage * 100;

            this.percentageText = `Stato ${this.percentage}%`;
            this.percentageType = this.percentage < 25 ? 'warning' : this.percentage < 50 ? 'secondary' : 'success';

            this.cdr.detectChanges();
            clearInterval(intSub);

        }, 1000);

    }
}
