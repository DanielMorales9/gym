import {User} from "./user.interface";
import {UserService} from "../services/users.service";
import {MessageService} from "../services/message.service";
import {Component, OnInit, Output, EventEmitter, Input} from "@angular/core";
import {ExchangeUserService} from "../services/exchange-user.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: 'user-modal',
    templateUrl: './user-modal.component.html',
    styleUrls: ['../app.component.css']
})
export class UserModalComponent implements OnInit {

    // questo event Emitter mi serve per
    // invocare il metodo del componente padre
    @Output()
    done = new EventEmitter();
    form: FormGroup;

    user: User;
    @Input() public modalMode: string;
    @Input() public modalId: string;
    @Input() public modalCloseId: string;
    @Input() public modalClosingMessage: string;
    @Input() public modalTitle: string;
    @Input() public role: number;
    loading: boolean;
    error = true;

    CONSTRAINT_VIOLATION_EXCEPTION = "ConstraintViolationException";

    // Message service mi serve per comunicare con l'app component
    constructor(private builder:FormBuilder,
                private service: UserService,
                private messageService: MessageService,
                private exchangeService: ExchangeUserService) {
        this.loading = false;
    }

    get f() { return this.form.controls; }


    ngOnInit(): void {

        console.log(this.modalMode, this.role);
        this.user = {
            id: NaN,
            email: '',
            height: NaN,
            weight: NaN,
            verified: false,
            defaultRoles: [],
            createdAt: '',
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
            type: ''};
        this.buildForm();
        this.exchangeService.getUser().subscribe((res) => {
            this.user = res;
            this.buildForm()
        });
    }

    buildForm() {
        const config = {};
        let height, weight, type, email, firstName, lastName = [];
        if (this.role == 1) {
            if (this.modalMode != 'edit')
                type = [Validators.required];
            if (this.modalMode == 'edit' && this.user.defaultRoles[0] == 3) {
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
            this.messageService.sendMessage(message);
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
            this.messageService.sendMessage(message);
        }
    }

    addRole() {
        this.service.addRole(this.user.id,
            this.f.type.value,
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
        this.service.patch(user, this._success("L'utente " + this.f.lastName.value),
            this._error( ""))
    }


    createUser() {
        let user = Object();
        user.firstName = this.f.firstName.value;
        user.lastName = this.f.lastName.value;
        user.email = this.f.email.value;
        user.type = this.f.type.value;
        this.service.post(user,
            this._success("L'utente " + this.f.lastName.value),
            this._error( "Esiste già un utente con questa email!"));
    }

}