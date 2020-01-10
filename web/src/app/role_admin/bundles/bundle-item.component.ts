import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatDialog} from '@angular/material';


@Component({
    selector: 'bundle-item',
    templateUrl: './bundle-item.component.html',
    styleUrls: ['../../styles/search-list.css', '../../styles/root.css'],
})
export class BundleItemComponent {

    @Input() bundle: any;

    @Output() done = new EventEmitter();

    PERSONAL = 'P';
    COURSE   = 'C';

    constructor(private dialog: MatDialog) {}

    // openDialog(): void {
    //     const title = 'Modifica Pacchetto';
    //
    //     const dialogRef = this.dialog.open(BundleModalComponent, {
    //         data: {
    //             title: title,
    //             bundle: this.bundle
    //         }
    //     });
    //
    //     dialogRef.afterClosed().subscribe(res => {
    //         if (res) {
    //             this.done.emit({type: 'put', bundle: res});
    //         }
    //     });
    // }

    getBundleType() {
        const defaultName = 'Allenamento Personale';
        let name;
        if (!this.bundle) { return name; }
        switch (this.bundle.type) {
            case this.PERSONAL:
                name = defaultName;
                break;
            case this.COURSE:
                name = 'Corso';
                break;
            default:
                name = defaultName;
                break;
        }
        return name;
    }

    goToInfo() {
        this.done.emit({type: 'info', bundle: this.bundle});
    }
}
