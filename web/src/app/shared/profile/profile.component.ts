import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {User} from '../model';
import {UserService} from '../../core/controllers';
import {MatDialog} from '@angular/material';
import {UserModalComponent} from '../users';
import {ChangePasswordModalComponent} from './change-password-modal.component';
import {AuthenticationService} from '../../core/authentication';
import {AuthService} from '../../core/controllers';
import {SnackBarService} from '../../core/utilities';
import {UserHelperService} from '../../core/helpers';
import {ImageModalComponent} from './image-modal.component';
import {ImageCropModalComponent} from './image-crop-modal.component';
import {LyDialog} from '@alyle/ui/dialog';
import {ImgCropperEvent} from '@alyle/ui/image-cropper';

@Component({
    templateUrl: './profile.component.html',
    styleUrls: ['../../styles/root.css', '../../styles/card.css'],
})
export class ProfileComponent implements OnInit {

    user: User;
    image_src: any;
    image_name: 'Immagine Profilo';

    constructor(private auth: AuthenticationService,
                private userService: UserService,
                private authService: AuthService,
                private snackbar: SnackBarService,
                private dialog: MatDialog,
                private _cd: ChangeDetectorRef,
                private _dialog: LyDialog) {
    }

    ngOnInit(): void {
        this.user = this.auth.getUser();
        this.getAvatar();
    }

    openDialog(): void {

        const dialogRef = this.dialog.open(UserModalComponent, {
            data: {
                title: 'Modifica i tuoi Dati',
                method: 'patch',
                user: this.user
            }
        });

        dialogRef.afterClosed().subscribe(async (user: User) => {
            if (user) {
                const [data, error] = await this.userService.patch(user);
                if (error) {
                    this.snackbar.open(error.error.message);
                } else {
                    this.snackbar.open(`L'utente ${user.lastName} è stato modificato`);
                }
            }
        });
    }

    getUserCreatedAt() {
        return UserHelperService.getUserCreatedAt(this.user);
    }

    async openPasswordDialog() {
        const dialogRef = this.dialog.open(ChangePasswordModalComponent);

        const passwordForm = await dialogRef.afterClosed().toPromise();

        if (passwordForm) {
            const [data, err] = await this.authService.changePassword(this.user.id, passwordForm);
            if (err) {
                this.snackbar.open(err.error.message);
            } else {
                const message = `${this.user.firstName}, la tua password è stata cambiata con successo!`;
                this.snackbar.open(message);
            }
        }
    }

    fileChange($event: Event) {
        console.log($event);
        // @ts-ignore
        const selectedFile = $event.target.files[0];

        this._dialog.open(ImageCropModalComponent, {
            data: $event,
            width: 320,
            disableClose: true
        }).afterClosed.subscribe((result?: ImgCropperEvent) => {
            if (result) {
                const cropped = result.dataURL;
                this._cd.markForCheck();

                const file = this.dataURLtoFile(result.dataURL, selectedFile.name);
                const uploadImageData = new FormData();
                uploadImageData.append('imageFile', file, file.name);

                this.userService.uploadImage(this.user.id, uploadImageData, { observe: 'response' })
                    .subscribe(res => { this.getAvatar(); });
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

    getAvatar() {
        this.userService.retrieveImage(this.user.id).subscribe((res: any) => {
            this.image_src = `data:${res.type};base64,${res.picByte}`;
        }, err => {
            const gender = this.user.gender ? 'woman' : 'man';
            this.image_src = `https://cdn0.iconfinder.com/data/icons/people-and-lifestyle-2/64/fitness-${gender}-lifestyle-avatar-512.png`;
        });
    }

    getRoleName() {
        let name;
        if (!this.user) { return name; }
        switch (this.user.type) {
            case 'A':
                name = 'Amministratore';
                break;
            case 'C':
                name = 'Cliente';
                break;
            case 'T':
                name = 'Allenatore';
                break;
            default:
                name = 'Cliente';
                break;
        }
        return name;
    }

    openImageDialog() {
        const dialogRef = this.dialog.open(ImageModalComponent, {
            data: this.image_src
        });
    }
}
