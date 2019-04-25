import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
    selector: 'search-date',
    templateUrl: './search-date.toolbar.html',
    styleUrls: ['../../styles/search-list.css', '../../styles/root.css']
})
export class SearchDateToolbar implements OnInit {

    @Input() query: string;
    @Input() datePlaceholder: string;
    @Input() maxDate: Date;

    @Output() done: EventEmitter<any> = new EventEmitter();
    date: FormControl;

    ngOnInit(): void {
        this.date = new FormControl(new Date(this.query));
    }

    emit(type, event) {
        this.done.emit({type: type, date: event.value});
    }

}

