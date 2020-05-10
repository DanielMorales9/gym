import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
    selector: 'search-date',
    templateUrl: './search-date.toolbar.html',
    styleUrls: ['../../styles/search-list.css', '../../styles/root.css'],
    changeDetection: ChangeDetectionStrategy.OnPush

})
export class SearchDateToolbar implements OnInit {

    @Input() query: any;
    @Input() datePlaceholder: string;
    @Input() maxDate: Date;

    @Input() filters: any;
    @Input() filterName: string;
    @Input() selected: any;

    @Output() done: EventEmitter<any> = new EventEmitter();
    date: FormControl;

    ngOnInit(): void {
        this.date = new FormControl(this.query ? this.query.date || undefined : undefined);
    }

    emit(type, event) {
        switch (type) {
            case 'date':
                if (!!event.value) { this.query.date = event.value; } else { delete this.query.date; }
                break;
            case this.filterName:
                if (event.value === undefined || event.value === null) {
                    delete this.query[this.filterName];
                } else {
                    this.query[this.filterName] = event.value;
                }
                break;
        }
        this.done.emit(this.query);
    }

}

