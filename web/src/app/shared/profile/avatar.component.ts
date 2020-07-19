import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {takeUntil} from 'rxjs/operators';
import {UserService} from '../../core/controllers';
import {BaseComponent} from '../base-component';
import {ImageModalComponent} from './image-modal.component';

@Component({
    selector: 'user-avatar',
    styleUrls: ['../../styles/root.css'],
    template: `
        <img style="width: 80px; height: 80px;"
             *ngIf="!!image_src" mat-card-avatar [alt]="image_name"
             [src]="image_src" (click)="openImageDialog()">
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvatarComponent extends BaseComponent {

    _user: any;

    @Input() set user(value: any) {
        if (!!value) {
            this._user = value;
            this.getAvatar();
        }
    }

    image_src: string;
    image_name: string;

    constructor(private userService: UserService,
                private dialog: MatDialog,
                private cdr: ChangeDetectorRef) {
        super();
    }

    getAvatar() {
        this.userService.retrieveImage(this._user.id)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((res: any) => {
                this.image_src = `data:${res.type};base64,${res.picByte}`;
                this.cdr.detectChanges();

            }, err => {
                const gender = this._user.gender ? 'woman' : 'man';
                this.image_src = `https://cdn0.iconfinder.com/data/icons/people-and-lifestyle-2/64/fitness-${gender}-lifestyle-avatar-512.png`;
                this.cdr.detectChanges();

            });
    }

    openImageDialog() {
        const dialogRef = this.dialog.open(ImageModalComponent, {
            data: this.image_src
        });
    }

}
