import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
    selector: 'search-date',
    templateUrl: './search-date.toolbar.html',
    styleUrls: ['../../styles/search-list.css', '../../styles/root.css']
})
export class SearchDateToolbar implements OnInit {

    @Input() query: any;
    @Input() datePlaceholder: string;
    @Input() maxDate: Date;

    @Output() done: EventEmitter<any> = new EventEmitter();
    date: FormControl;

    ngOnInit(): void {
        this.date = new FormControl(this.query.date || undefined);
    }

    emit(type, event) {
        if (event.value) { this.query.date = event.value; } else { delete this.query.date; }
        this.done.emit(this.query);
    }

}

