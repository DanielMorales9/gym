import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
    templateUrl: './error.component.html',
    styleUrls: ['../styles/root.css', '../styles/card.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorComponent implements OnInit {
    message: string;
    title: string;

    constructor(private router: ActivatedRoute,
                private cdr: ChangeDetectorRef) {
    }


    ngOnInit(): void {
        const title = this.router.snapshot.queryParamMap.get('title');
        const message = this.router.snapshot.queryParamMap.get('message');
        if (message === 'Invalid Token Exception') {
            this.title = 'Token non valido!';
            this.message = 'Rivolgiti in segreteria per risolvere il problema.';
        } else {
            this.title = "Qualcosa è andato storto";
            this.message = "Prova più tardi oppure ricarica la pagina";

        }
        this.cdr.detectChanges();
    }

}
