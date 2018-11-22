import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";

@Component({
    templateUrl: './error.component.html'
})
export class ErrorComponent implements OnInit {
    message: string;

    constructor(private router: ActivatedRoute) {
    }

    ngOnInit(): void {
        var message = this.router.snapshot.queryParamMap.get("message");
        switch (message) {

            case "Invalid Token Exception":
                this.message = "Token invalido. <br> Rivolgiti all'amministratore per risolvere il problema.";
                break;

        }
    }

}