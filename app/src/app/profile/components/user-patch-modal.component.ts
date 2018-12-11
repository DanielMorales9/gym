import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {Role, User} from "../../shared/model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserHelperService, UserService} from "../../shared/services";
import {ExchangeUserService, NotificationService} from "../../services";
import {a} from "@angular/core/src/render3";

@Component({
    selector: 'user-patch-modal',
    templateUrl: './user-patch-modal.component.html',
    styleUrls: ['../../app.component.css']
})
export class UserPatchModalComponent implements OnInit {

    @Output() public done = new EventEmitter();
    user: User;
    role: number;

    form: FormGroup;
    loading: boolean;


    constructor(private builder: FormBuilder,
                private service: UserService,
                private userHelperService: UserHelperService,
                private exchangeUserService: ExchangeUserService,
                private messageService: NotificationService) {
        this.loading = false;
    }

    ngOnInit(): void {
        this.user = new User();
        this.buildForm();

        this.exchangeUserService.getUser().subscribe(value => {
            this.user = value;
            this.role = this.user.roles.reduce( (a, b) => {
                return (a.id < b.id) ? a: b;
            }).id;
            this.buildForm();
        });
    }

    buildForm() {
        let config = {};

        config['firstName'] = [this.user.firstName, [Validators.required]];
        config['lastName'] = [this.user.lastName, [Validators.required]];
        if (!this.role || this.role == 3) {
            config['height'] = [this.user.height, [
                Validators.required,
                Validators.max(300),
                Validators.min(100)]];
            config['weight'] = [this.user.height, [
                Validators.required,
                Validators.max(1000),
                Validators.min(20)]];
        }

        this.form = this.builder.group(config);
    }

    get firstName() {
        return this.form.get("firstName")
    }

    get lastName() {
        return this.form.get("lastName")
    }

    get height() {
        return this.form.get("height")
    }

    get weight() {
        return this.form.get("weight")
    }

    _success() {
        return res => {
            this.loading = false;
            document.getElementById("patchModalClose").click();
            let message = {
                text: `"L'utente ${this.lastName.value} è stato modificato`,
                class: "alert-success"
            };
            this.messageService.sendMessage(message);
            this.done.emit('completed');
        }
    }

    _error() {
        return err => {
            this.loading = false;
            document.getElementById("patchModalClose").click();
            let message = {
                text: "Errore Interno al Sistema.",
                class: "alert-danger"
            };
            this.messageService.sendMessage(message);
        }
    }

    editUser() {
        this.loading = true;
        delete this.user.roles;
        this.service.patch(this.user).subscribe(this._success(), this._error())
    }

}