import {MatDialogRef} from '@angular/material';

export abstract class BaseCalendarModal {

    modalData: {action: string, title: string, role: number, userId: number, event: any};

    public message: {text: string, class: string};

    constructor(public dialogRef: MatDialogRef<BaseCalendarModal>) {}

    abstract submit();

    close(data?) {
        this.dialogRef.close(data);
    }

    onComplete() {
        this.close({});
    }

}
