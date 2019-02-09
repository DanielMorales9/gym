import {Component, EventEmitter, OnInit, Output} from "@angular/core";
import {User} from "../../shared/model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../shared/services";
import {AppService, ExchangeUserService, NotificationService} from "../../services";


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
                private appService: AppService,
                private exchangeUserService: ExchangeUserService,
                private messageService: NotificationService) {
        this.loading = false;
    }

    ngOnInit(): void {
        this.user = new User();
        this.buildForm();
        this.exchangeUserService.getUser().subscribe(value => {
            this.user = value;
            this.service.getRoles(this.user.id).subscribe((res) => {
                this.role = Math.min(...res['_embedded']['roles'].map(val => this.appService.ROLE2INDEX[val.name]));
                this.buildForm()
            })
        });
    }

    buildForm() {
        let config = {};

        config['firstName'] = [this.user.firstName, [Validators.required]];
        config['lastName'] = [this.user.lastName, [Validators.required]];
        config['email'] = [this.user.email, [Validators.required, Validators.email]];
        if (!!this.role && this.role == 3) {
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

    get email() {
        return this.form.get("email")
    }

    editUser() {
        this.loading = true;

        delete this.user.roles;
        this.user.firstName = this.firstName.value;
        this.user.lastName = this.lastName.value;
        this.user.email = this.email.value;

        if (this.height && this.weight) {
            this.user.height = this.height.value;
            this.user.weight = this.weight.value;
        }

        this.service.patch(this.user).subscribe( _ => {
            this.messageService.sendMessage({
                text: `L'utente ${this.lastName.value} è stato modificato`,
                class: "alert-success"
            });
            this.done.emit('completed');
        }, err => {
            this.messageService.sendMessage({
                text: err.error.message,
                class: "alert-danger"
            });
        }, () => {
            this.loading = false;
            document.getElementById("patchModalClose").click();
        })
    }

}