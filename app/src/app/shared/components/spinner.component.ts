import {Component, Input} from "@angular/core";

@Component({
    selector: 'spinner',
    template: "<div id=\"loader\" [hidden]=\"!loading\">\n" +
        "<div class=\"spinner\">\n" +
        "<div class=\"bounce1\"></div>\n" +
        "    <div class=\"bounce2\"></div>\n" +
        "    <div class=\"bounce3\"></div>\n" +
        "    </div>\n" +
        "    </div>",
    styleUrls: ['../../app.component.css']
})
export class SpinnerComponent {

    @Input()
    loading: boolean = false;

}