import { Injectable } from '@angular/core';
import {AuthenticationService} from '../authentication';

@Injectable()
export class PolicyService {

    constructor(private auth: AuthenticationService) {}

    ADMIN_POLICY = {
        bundleSpec: {
            canDelete: true,
            canEdit: true,
            canDisable: true,
            canCreate: true,
            canShow: {
                editions: true
            }
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
                sales: true
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
        }
    };

    TRAINER_POLICY = {
        bundleSpec: {
            canDelete: false,
            canEdit: false,
            canDisable: false,
            canCreate: false,
            canShow: {
                editions: true
            }
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
                sales: false
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
        }
    };


    CUSTOMER_POLICY = {
        bundleSpec: {
            canDelete: false,
            canCreate: false,
            canEdit: false,
            canDisable: false,
            canShow: {
                editions: false
            }
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
                sales: false
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
        }
    };

    POLICIES = [this.ADMIN_POLICY, this.TRAINER_POLICY, this.CUSTOMER_POLICY];


    get(entity: string, ...action) {
        const myPolicy = this.POLICIES[this.auth.getCurrentUserRole() - 1];
        if (entity in myPolicy) {
            let policy = myPolicy[entity];
            let a, index;
            for (index = 0; index < action.length; ++index) {
                a = action[index];
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
}
