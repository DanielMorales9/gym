import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {BundleSpecsService} from '../../core/controllers';
import {BundleType, CourseBundleSpecification, OptionType, PersonalBundleSpecification} from '../model';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {BundleSpecModalComponent} from './bundle-spec-modal.component';
import {PolicyService} from '../../core/policy';
import {OptionModalComponent} from './option-modal.component';
import {SnackBarService} from '../../core/utilities';
import {of} from 'rxjs';
import {filter, switchMap, takeUntil} from 'rxjs/operators';
import {BaseComponent} from '../base-component';

@Component({
    selector: 'bundle-spec-details',
    templateUrl: './bundle-spec-details.component.html',
    styleUrls: ['../../styles/details.css', '../../styles/root.css', '../../styles/card.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BundleSpecDetailsComponent extends BaseComponent implements OnInit {
    PERSONAL = BundleType.PERSONAL;
    COURSE   = BundleType.COURSE;

    bundleSpec: CourseBundleSpecification|PersonalBundleSpecification;

    optionNames = OptionType;

    canDelete: boolean;
    canDisable: boolean;
    displayedPaymentsColumns: String[];
    canDeleteOption: boolean;
    canMakeOption: boolean;
    canEdit: boolean;

    constructor(private service: BundleSpecsService,
                private dialog: MatDialog,
                private router: Router,
                private policy: PolicyService,
                private snackBar: SnackBarService,
                private cdr: ChangeDetectorRef,
                private route: ActivatedRoute) {
        super();
    }

    ngOnInit(): void {
        this.getPolicies();
        const displayedPaymentsColumns = ['index', 'name', 'number', 'price', 'type'];

        if (this.canDeleteOption) {
            displayedPaymentsColumns.push('actions');
        }

        this.displayedPaymentsColumns = displayedPaymentsColumns;

        this.route.params
            .pipe(
                takeUntil(this.unsubscribe$),
                switchMap(params => this.getBundleSpec(+params['id'])))
            .subscribe(res => {
                this.bundleSpec = res;
                this.cdr.detectChanges();
        });
    }

    private getPolicies() {
        this.canDelete = this.policy.get('bundleSpec', 'canDelete');
        this.canDisable = this.policy.get('bundleSpec', 'canDisable');
        this.canEdit = this.policy.get('bundleSpec', 'canEdit');
        this.canMakeOption = this.policy.get('option', 'canCreate');
        this.canDeleteOption = this.policy.get('option', 'canDelete');
    }

    editBundleSpec(): void {
        const title = 'Modifica Pacchetto';

        const dialogRef = this.dialog.open(BundleSpecModalComponent, {
            data: {
                title: title,
                bundle: this.bundleSpec
            }
        });

        dialogRef.afterClosed()
            .pipe(
                takeUntil(this.unsubscribe$),
                filter(v => !!v),
                switchMap(v => this.service.patchBundleSpecs(v)))
            .subscribe((v: CourseBundleSpecification|PersonalBundleSpecification) => this.bundleSpec = v);
    }

    deleteBundle() {
        of(confirm(`Vuoi eliminare il pacchetto ${this.bundleSpec.name}?`))
            .pipe(takeUntil(this.unsubscribe$), filter(v => !!v),
                switchMap(v => this.service.deleteBundleSpecs(this.bundleSpec.id)))
                .subscribe(_ =>
                this.router.navigateByUrl('/', {
                    replaceUrl: true
                }));
    }

    toggleDisabled() {
        this.bundleSpec.disabled = !this.bundleSpec.disabled;
        this.service.patchBundleSpecs(this.bundleSpec);
    }

    private getBundleSpec(id: number) {
        return this.service.findBundleSpecById(id);
    }

    getBundleType() {
        let name;
        if (!this.bundleSpec) { return name; }
        switch (this.bundleSpec.type) {
            case this.PERSONAL:
                name = 'Allenamento Personale';
                break;
            case this.COURSE:
                name = 'Corso';
                break;
            default:
                name = 'Allenamento Personale';
                break;
        }
        return name;
    }

    createOption() {
        const title = 'Crea Opzione';

        const dialogRef = this.dialog.open(OptionModalComponent, {
            data: {
                title: title,
                bundle: this.bundleSpec
            }
        });

        dialogRef.afterClosed()
            .pipe(
                takeUntil(this.unsubscribe$),
                filter(v => !!v),
                switchMap(res => {
                    return this.service.createOption(this.bundleSpec.id, res);
                }))
            .subscribe(res => {
                this.bundleSpec = res;
            });
    }

    deleteOption(id: any) {
        of(confirm('Sei sicuro di voler eliminare l\'opzione?'))
            .pipe(
                takeUntil(this.unsubscribe$),
                switchMap(v => this.service.deleteOption(this.bundleSpec.id, id))
            )
            .subscribe(
                data => this.bundleSpec = data,
                error => this.snackBar.open('Impossibile eliminare opzione in uso'));
    }

}
