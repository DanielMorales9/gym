import { Injectable, OnDestroy, OnInit, Directive } from '@angular/core';
import {AuthenticationDirective} from '../authentication';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {CanDelete, CanDisable, CanEdit} from '../../shared/model';

@Directive()
@Injectable()
export class PolicyServiceDirective implements OnDestroy {

    constructor(private auth: AuthenticationDirective) {}

    unsubscribe$ = new Subject<void>();

    ADMIN_POLICY = {
        gym: {
            canEdit: true
        },
        events: {
            canShowCourse: true,
            canShowPersonal: true,
            canShowTimeOff: true,
            canShowHoliday: true
        },
        bundleSpec: {
            canDelete: true,
            canEdit: true,
            canDisable: true,
            canCreate: true,
            canBookExternal: true
        },
        option: {
            canCreate: true,
            canDelete: true,
        },
        sale: {
            canDelete: true,
            canPay: true,
            canSell: true
        },
        user: {
            canDelete: true,
            canCreate: true,
            canEdit: true
        },
        admin: {
            canEdit: true,
            canDelete: true,
            canCreate: true,
            canSell: false,
            canSendToken: true,
            canMakeAppointments: false,
            canShow: {
                bundles: false,
                sales: false
            }
        },
        customer: {
            canEdit: true,
            canDelete: true,
            canCreate: true,
            canSell: true,
            canSendToken: true,
            canMakeAppointments: true,
            canShow: {
                bundles: true,
                sales: true,
                stats: true,
                sessions: true
            }
        },
        trainer: {
            canEdit: true,
            canDelete: true,
            canCreate: true,
            canSell: false,
            canSendToken: true,
            canMakeAppointments: false,
            canShow: {
                bundles: false,
                sales: false
            }
        },
        bundle: {
            canDelete: true,
            canEdit: true
        },
        payment: {
            canDelete: true
        },
        reservation: {
            canConfirm: true,
            canDelete: true
        },
        course: {
            canDelete: true,
            canConfirm: false,
            canBookAll: true,
        },
        personal: {
            canDelete: true,
            canComplete: true,
            canConfirm: true,
            canAssignWorkout: true,
        },
        timeOff: {
            canDelete: true
        },
        holiday: {
            canDelete: true
        },
        workout: {
            canCreate: true,
            canDelete: true,
            canEdit: true,
            canShow: true,
        }

    };

    TRAINER_POLICY = {
        gym: {
            canEdit: false
        },
        events: {
            canShowCourse: true,
            canShowPersonal: true,
            canShowTimeOff: true,
            canShowHoliday: true
        },
        bundleSpec: {
            canDelete: false,
            canEdit: false,
            canDisable: false,
            canCreate: false,
            canBookExternal: true
        },
        sale: {
            canDelete: false,
            canPay: false
        },
        user: {
            canDelete: false,
            canCreate: false,
            canEdit: false
        },
        admin: {
            canEdit: false,
            canDelete: false,
            canCreate: false,
            canSell: false,
            canSendToken: false,
            canMakeAppointments: false,
            canShow: {
                bundles: false,
                sales: false
            }
        },
        customer: {
            canEdit: false,
            canDelete: false,
            canCreate: false,
            canSell: false,
            canSendToken: false,
            canMakeAppointments: true,
            canShow: {
                bundles: true,
                sales: false,
                stats: true,
                sessions: true
            }
        },
        trainer: {
            canEdit: false,
            canDelete: false,
            canCreate: false,
            canSell: false,
            canSendToken: false,
            canMakeAppointments: false,
            canShow: {
                bundles: false,
                sales: false
            }
        },
        bundle: {
            canDelete: false,
            canEdit: false
        },
        reservation: {
            canConfirm: true,
            canDelete: true
        },
        course: {
            canDelete: false,
            canBookAll: true,
        },
        personal: {
            canDelete: true,
            canComplete: true,
            canConfirm: true,
            canAssignWorkout: true,
        },
        timeOff: {
            canDelete: true
        },
        holiday: {
            canDelete: false
        },
        workout: {
            canCreate: true,
            canDelete: true,
            canEdit: true,
            canShow: true,

        }
    };

    CUSTOMER_POLICY = {
        gym: {
            canEdit: false
        },
        events: {
            canShowCourse: true,
            canShowPersonal: true,
            canShowTimeOff: false,
            canShowHoliday: true
        },
        bundleSpec: {
            canDelete: false,
            canCreate: false,
            canEdit: false,
            canDisable: false,
            canBookExternal: false
        },
        sale: {
            canDelete: false,
            canPay: false
        },
        user: {
            canDelete: false,
            canCreate: false,
            canEdit: true
        },
        admin: {
            canEdit: false,
            canDelete: false,
            canCreate: false,
            canSell: false,
            canSendToken: false,
            canMakeAppointments: false,
            canShow: {
                bundles: false,
                sales: false
            }
        },
        customer: {
            canEdit: false,
            canDelete: false,
            canCreate: false,
            canSell: false,
            canSendToken: false,
            canMakeAppointments: false,
            canShow: {
                bundles: true,
                sales: false,
                stats: true,
                sessions: true
            }
        },
        trainer: {
            canEdit: false,
            canDelete: false,
            canCreate: false,
            canSell: false,
            canSendToken: false,
            canMakeAppointments: false,
            canShow: {
                bundles: false,
                sales: false
            }
        },
        bundle: {
            canDelete: false,
            canEdit: false
        },
        personal: {},
        course: {
            canBook: true,
        }
    };

    POLICIES = [this.ADMIN_POLICY, this.TRAINER_POLICY, this.CUSTOMER_POLICY];


    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    get(entity: string, ...actions) {
        const currentRoleId = this.auth.getCurrentUserRoleId();

        const myPolicy = this.POLICIES[currentRoleId - 1];
        if (entity in myPolicy) {
            let policy = myPolicy[entity];
            let a, index;
            for (index = 0; index < actions.length; ++index) {
                a = actions[index];
                if (a in policy) {
                    policy = policy[a];
                }
                else {
                    return false;
                }
            }
            return policy;
        }
        return false;
    }

    canDelete(obj: CanDelete) {
        return this.get(obj.getName(), 'canDelete') && obj.canDelete();
    }

    canEdit(obj: CanEdit) {
        return this.get(obj.getName(), 'canEdit') && obj.canEdit();
    }

    canDisable(obj: CanDisable) {
        return this.get(obj.getName(), 'canDisable') && obj.canDisable();
    }

}
