import {MatDialogRef} from '@angular/material';

export abstract class BaseCalendarModal {

    modalData: any;

    public message: {text: string, class: string};

    protected constructor(public dialogRef: MatDialogRef<BaseCalendarModal>) {}

    abstract submit();

    close(data?) {
        this.dialogRef.close(data);
    }

}
