import {Injectable} from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable()
export class SnackBarService {

    private config: MatSnackBarConfig = {
        duration: 2000
    };

    constructor(private snackbar: MatSnackBar) {}

    open(message: string, action?: string, config?: MatSnackBarConfig) {
        if (config === undefined) {
            config = this.config;
        }

        if (action === undefined) {
            action = 'Chiudi';
        }

        this.snackbar.open(message, action, config);
    }
}
