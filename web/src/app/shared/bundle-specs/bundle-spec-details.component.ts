import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {BundleSpecsService} from '../../core/controllers';
import {
    BundleSpecification,
    BundleType,
    BundleTypeConstant,
    CourseBundleSpecification,
    OptionType,
    PersonalBundleSpecification
} from '../model';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {BundleSpecModalComponent} from './bundle-spec-modal.component';
import {PolicyServiceDirective} from '../../core/policy';
import {OptionModalComponent} from './option-modal.component';
import {SnackBarService} from '../../core/utilities';
import {of} from 'rxjs';
import {filter, map, switchMap, takeUntil} from 'rxjs/operators';
import {BaseComponent} from '../base-component';
import {GetPolicies} from '../policy.interface';
import {mapToBundleSpec} from '../mappers';

@Component({
    selector: 'bundle-spec-details',
    templateUrl: './bundle-spec-details.component.html',
    styleUrls: ['../../styles/details.css', '../../styles/root.css', '../../styles/card.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BundleSpecDetailsComponent extends BaseComponent implements GetPolicies, OnInit {
    COURSE   = BundleTypeConstant.COURSE;

    bundleSpec: BundleSpecification;

    optionNames = OptionType;

    canDeleteSpec: boolean;
    canDisableSpec: boolean;
    displayedPaymentsColumns: String[];
    canDeleteOption: boolean;
    canMakeOption: boolean;
    canEditSpec: boolean;
    bundleType = BundleType;


    constructor(private service: BundleSpecsService,
                private dialog: MatDialog,
                private router: Router,
                private policy: PolicyServiceDirective,
                private snackBar: SnackBarService,
                private cdr: ChangeDetectorRef,
                private route: ActivatedRoute) {
        super();
    }

    ngOnInit(): void {
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
                this.getPolicies();
                this.cdr.detectChanges();
            });
    }

    getPolicies() {
        this.canDeleteSpec = this.policy.canDelete(this.bundleSpec);
        this.canEditSpec = this.policy.canEdit(this.bundleSpec);
        this.canDisableSpec = this.policy.canDisable(this.bundleSpec);
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
            .subscribe((v: BundleSpecification) => {
                this.bundleSpec = v;
                this.cdr.detectChanges();
            });
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
        this.service.patchBundleSpecs(this.bundleSpec)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(v => {
                this.cdr.detectChanges();
            });
    }

    private getBundleSpec(id: number) {
        return this.service.findBundleSpecById(id).pipe(map(mapToBundleSpec));
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
                this.cdr.detectChanges();
            });
    }

    deleteOption(id: any) {
        of(confirm('Sei sicuro di voler eliminare l\'opzione?'))
            .pipe(
                takeUntil(this.unsubscribe$),
                switchMap(v => this.service.deleteOption(this.bundleSpec.id, id))
            )
            .subscribe(
                data => {
                    this.bundleSpec = data;
                    this.cdr.detectChanges();
                },
                error => this.snackBar.open('Impossibile eliminare opzione in uso'));
    }

}
