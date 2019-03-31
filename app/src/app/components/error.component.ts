import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";

@Component({
    templateUrl: './error.component.html',
    styleUrls: ['../root.css', '../card.css']
})
export class ErrorComponent implements OnInit {
    message: string;
    title: string;

    constructor(private router: ActivatedRoute) {
    }

    // TODO write handler for Whitelabel Error Page

    ngOnInit(): void {
        let message = this.router.snapshot.queryParamMap.get("message");
        let title = this.router.snapshot.queryParamMap.get("title");
        switch (message) {
            case "Invalid Token Exception":
                this.title = "Token non valido!";
                this.message = "Rivolgiti all'amministratore per risolvere il problema.";
                break;
            default:
                this.title = title;
                this.message = message;
                break
        }
    }

}
