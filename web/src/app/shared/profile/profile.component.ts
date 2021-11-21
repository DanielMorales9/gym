import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {TypeNames, User} from '../model';
import {AuthService, UserService} from '../../core/controllers';
import {MatDialog} from '@angular/material/dialog';
import {UserModalComponent} from '../users';
import {ChangePasswordModalComponent} from './change-password-modal.component';
import {AuthenticationDirective} from '../../core/authentication';
import {SnackBarService} from '../../core/utilities';
import {ImageCropModalComponent} from './image-crop-modal.component';
import {LyDialog} from '@alyle/ui/dialog';
import {ImgCropperEvent} from '@alyle/ui/image-cropper';
import {filter, switchMap, takeUntil} from 'rxjs/operators';
import {of} from 'rxjs';
import {BaseComponent} from '../base-component';

@Component({
    templateUrl: './profile.component.html',
    styleUrls: ['../../styles/root.css', '../../styles/card.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent extends BaseComponent implements OnInit {

    user: User;
    mapNames = TypeNames;

    constructor(private auth: AuthenticationDirective,
                private userService: UserService,
                private authService: AuthService,
                private snackbar: SnackBarService,
                private dialog: MatDialog,
                private cdr: ChangeDetectorRef,
                private _dialog: LyDialog) {
        super();
    }

    ngOnInit(): void {
        this.auth.getObservableUser()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(v => {
                if (!this.user) {
                    this.user = v;
                    this.cdr.detectChanges();
                }
            });

    }

    openDialog(): void {

        const dialogRef = this.dialog.open(UserModalComponent, {
            data: {
                title: 'Modifica i tuoi Dati',
                method: 'patch',
                user: this.user
            }
        });

        dialogRef.afterClosed()
            .pipe(
                switchMap(user => {
                    if (user) {
                        return this.userService.patchUser(user);
                    }
                    return of(null);
                }),
                filter(res => res !== null)
            )
            .subscribe((user: User) => this.snackbar.open(`L'utente ${user.lastName} è stato modificato`),
                error => this.snackbar.open(error.error.message));
    }

    openPasswordDialog() {
        const dialogRef = this.dialog.open(ChangePasswordModalComponent);

        dialogRef.afterClosed()
            .pipe(
                takeUntil(this.unsubscribe$),
                filter(v => !!v),
                switchMap(v => this.authService.changePassword(this.user.id, v)))
            .subscribe(r => {
                const message = `${this.user.firstName}, la tua password è stata cambiata con successo!`;
                this.snackbar.open(message);
            }, err => this.snackbar.open(err.error.message));
    }

    fileChange($event: Event) {
        // @ts-ignore
        const selectedFile = $event.target.files[0];

        this._dialog.open(ImageCropModalComponent, {
            data: $event,
            width: 320,
            disableClose: true
        }).afterClosed
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((result?: ImgCropperEvent) => {
                if (result) {
                    const cropped = result.dataURL;
                    this.cdr.markForCheck();

                    const file = this.dataURLtoFile(result.dataURL, selectedFile.name);
                    const uploadImageData = new FormData();
                    uploadImageData.append('imageFile', file, file.name);

                    this.userService.uploadImage(this.user.id, uploadImageData)
                        .subscribe(res => {
                            this.user = res as any;
                            this.cdr.detectChanges();
                        });
                }
            });

    }

    dataURLtoFile(dataurl, filename) {
        const arr = dataurl.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const b_str = atob(arr[1]);
        let n = b_str.length;
        const u8arr = new Uint8Array(n);
        while (n) {
            u8arr[n - 1] = b_str.charCodeAt(n - 1);
            n -= 1;
        }
        return new File([u8arr], filename, { type: mime });
    }
}
