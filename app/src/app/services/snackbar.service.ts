import {Injectable} from '@angular/core';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material';

@Injectable()
export class SnackBarService {

    private config: MatSnackBarConfig = {
        duration: 2000
    };

    constructor(private snackbar: MatSnackBar) {}

    open(message: string, action?: string, config?: MatSnackBarConfig) {
        if (config) {
            config = this.config;
        }
        if (action) {
            action = 'Chiudi'
        }
        this.snackbar.open(message, action, config)
    }
}
