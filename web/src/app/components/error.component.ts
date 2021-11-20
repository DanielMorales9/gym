import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    templateUrl: './error.component.html',
    styleUrls: ['../styles/root.css', '../styles/card.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorComponent implements OnInit {
    message: string;
    title: string;
    showRefreshButton = false;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private cdr: ChangeDetectorRef) {
    }


    ngOnInit(): void {
        const message = this.route.snapshot.queryParamMap.get('message');
        if (message === 'Invalid Token Exception') {
            this.title = 'Token non valido!';
            this.message = 'Rivolgiti in segreteria per risolvere il problema.';
            this.showRefreshButton = false;
        } else {
            this.title = 'Qualcosa è andato storto';
            this.message = 'Prova più tardi oppure ricarica la pagina';
            this.showRefreshButton = true;
        }
        this.cdr.detectChanges();
    }

    refresh() {
        this.router.navigateByUrl('/');
    }
}
