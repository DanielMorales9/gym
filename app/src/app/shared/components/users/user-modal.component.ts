import {Component, OnInit, Output, EventEmitter, Input} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserService, ExchangeUserService, UserHelperService} from "../../services/";
import {User} from "../../model";
import {NotificationService} from "../../../services";

@Component({
    selector: 'user-modal',
    templateUrl: './user-modal.component.html',
    styleUrls: ['../../../app.component.css']
})
export class UserModalComponent implements OnInit {

    // questo event Emitter mi serve per
    // invocare il metodo del componente padre
    @Output() public done = new EventEmitter();

    @Input() public modalMode: string;
    @Input() public modalId: string;
    @Input() public modalCloseId: string;
    @Input() public modalClosingMessage: string;
    @Input() public modalTitle: string;
    @Input() public role: number;

    form: FormGroup;
    user: User;
    loading: boolean;
    error = true;

    CONSTRAINT_VIOLATION_EXCEPTION = "ConstraintViolationException";

    constructor(private builder: FormBuilder,
                private service: UserService,
                private userHelperService: UserHelperService,
                private notificationService: NotificationService,
                private exchangeService: ExchangeUserService) {
        this.loading = false;
    }

    get f() { return this.form.controls; }


    ngOnInit(): void {
        this.user = new User();
        this.buildForm();
        this.exchangeService.getUser().subscribe((user) => {
            this.user = user;
            this.buildForm()
        });
    }

    isCustomer() {
        return this.userHelperService.getHighestRole(this.user) == 3
    }

    buildForm() {
        const config = {};
        let height, weight, type, email, firstName, lastName = [];

        if (this.role == 1) {
            if (this.modalMode != 'edit')
                type = [Validators.required];
            if (this.modalMode == 'edit' && this.isCustomer()) {
                height = [Validators.required, Validators.max(300), Validators.min(100)];
                weight = [Validators.required, Validators.max(1000), Validators.min(20)];
            }
            if (this.modalMode != 'add') {
                email = [Validators.required, Validators.email];
                firstName = [Validators.required];
                lastName = [Validators.required]
            }
        }
        config['email'] = [this.user.email, email];
        config["type"] = [this.user.type, type];
        config["height"] = [this.user.height, height];
        config["weight"] = [this.user.weight, weight];
        config["firstName"] = [this.user.firstName, firstName];
        config["lastName"] = [this.user.lastName, lastName];
        this.form = this.builder.group(config);
    }

    submitUser() {
        this.loading = true;
        switch (this.modalMode) {
            case "create":
                this.createUser();
                break;
            case "edit":
                this.editUser();
                break;
            case "add":
                this.addRole();
                break;
            default:
                this.createUser();
                break;
        }
    }

    _success(mex) {
        return res => {
            this.loading = false;
            document.getElementById(this.modalCloseId).click();
            let message = {
                text: mex + this.modalClosingMessage,
                class: "alert-success"
            };
            this.notificationService.sendMessage(message);
            this.done.emit('completed');
        }
    }

    _error(err_mex) {
        return err => {
            this.loading = false;
            document.getElementById(this.modalCloseId).click();
            let text = "Errore Interno al Sistema.";
            if (err.error) {
                if (err.error.message) {
                    if (err.error.message.indexOf(this.CONSTRAINT_VIOLATION_EXCEPTION) > -1)
                        text = err_mex;
                }
            }
            let message = {
                text: text,
                class: "alert-danger"
            };
            this.notificationService.sendMessage(message);
        }
    }

    addRole() {
        this.service.addRole(this.user.id, this.f.type.value).subscribe(
            this._success("Il Ruolo " + this.f.type.value),
            this._error( "L'utente ha già questo ruolo!"))
    }

    editUser() {
        let user = Object();
        user.id = this.user.id;
        user.firstName = this.f.firstName.value;
        user.lastName = this.f.lastName.value;
        user.email = this.f.email.value;
        user.type = this.f.type.value;
        user.height = this.f.height.value;
        user.weight = this.f.weight.value;
        this.service.patch(user).subscribe(
            this._success("L'utente " + this.f.lastName.value),
            this._error( ""))
    }


    createUser() {
        let user = new User();
        user.firstName = this.f.firstName.value;
        user.lastName = this.f.lastName.value;
        user.email = this.f.email.value;
        user.type = this.f.type.value;
        this.service.post(user).subscribe(
            this._success("L'utente " + this.f.lastName.value),
            this._error( "Esiste già un utente con questa email!"));
    }

}