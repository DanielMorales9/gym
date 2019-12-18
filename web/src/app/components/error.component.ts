import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
    templateUrl: './error.component.html',
    styleUrls: ['../styles/root.css', '../styles/card.css']
})
export class ErrorComponent implements OnInit {
    message: string;
    title: string;

    constructor(private router: ActivatedRoute) {
    }


    ngOnInit(): void {
        const message = this.router.snapshot.queryParamMap.get('message');
        const title = this.router.snapshot.queryParamMap.get('title');
        if (message === 'Invalid Token Exception') {
            this.title = 'Token non valido!';
            this.message = 'Rivolgiti all\'amministratore per risolvere il problema.';
        } else {
            this.title = title;
            this.message = message;
        }
    }

}
