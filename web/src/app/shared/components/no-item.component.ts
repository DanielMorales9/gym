import {Component, Input} from "@angular/core";

@Component({
    selector: 'no-item',
    templateUrl: './no-item.component.html',
    styleUrls: ['../../styles/root.css', '../../styles/search-list.css']
})
export class NoItemComponent {

    @Input()
    public message: string;

    constructor() { }

}
