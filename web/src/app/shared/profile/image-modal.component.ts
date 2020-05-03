import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
    templateUrl: './image-modal.component.html',
    styleUrls: ['../../styles/root.css'],
})
export class ImageModalComponent implements OnInit {

    image_src: any;
    title: string;
    method: string;

    form = new FormGroup({});

    constructor(private builder: FormBuilder,
                public dialogRef: MatDialogRef<ImageModalComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        this.image_src = data;
    }

    ngOnInit(): void { }

    submit() {
        this.dialogRef.close();
    }
}
