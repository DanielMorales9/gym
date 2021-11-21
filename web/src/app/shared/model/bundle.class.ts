import {Session} from './session.class';
import {User} from './user.class';
import {CanDelete, CanEdit} from './policy.interface';
import {BundleSpecification, CourseBundleSpecification, PersonalBundleSpecification} from './';
import {BundlePurchaseOption, Option} from './option.class';

export enum BundleTypeConstant {
    PERSONAL =  'P',
    COURSE = 'C'
}

export enum BundleEntity {
    P =  'personal',
    C = 'course'
}

export enum BundleType {
    P = 'Allenamento Personalizzato',
    C = 'Corso'
}

export abstract class Bundle implements CanDelete, CanEdit {
    id: number;
    name: string;
    expired: boolean;
    expiredAt: Date;
    type: string;
    option: Option;
    deletable: boolean;
    sessions: Session[];
    customer: User;
    bundleSpec: BundleSpecification;
    unlimitedDeletions: boolean;
    numDeletions: number;
    startTime: number;
    endTime: number;

    protected constructor(id: number,
                          name: string,
                          expired: boolean,
                          expiredAt: Date,
                          type: string,
                          option: Option,
                          deletable: boolean,
                          sessions: Session[],
                          customer: User,
                          bundleSpec: BundleSpecification,
                          startTime: number,
                          endTime: number,
                          unlimitedDeletions: boolean,
                          numDeletions: number) {
        this.id = id;
        this.name = name;
        this.expired = expired;
        this.expiredAt = expiredAt;
        this.type = type;
        this.option = option;
        this.deletable = deletable;
        this.sessions = sessions;
        this.customer = customer;
        this.bundleSpec = bundleSpec;
        this.startTime = startTime;
        this.endTime = endTime;
        this.unlimitedDeletions = unlimitedDeletions;
        this.numDeletions = numDeletions;
    }

    public abstract getPrice();

    public canDelete() {
        return this.deletable;
    }

    public abstract isActive(): boolean;

    getName(): string {
        return 'bundle';
    }

    canEdit(): boolean {
        return !(this.option instanceof BundlePurchaseOption);
    }

    progress(): number {
        return this.option.progress(this);
    }
}

export class PersonalBundle extends Bundle {

    bundleSpec: PersonalBundleSpecification;

    constructor(id: number,
                name: string,
                expired: boolean,
                expiredAt: Date,
                type: string,
                option: Option,
                deletable: boolean,
                sessions: Session[],
                customer: User,
                bundleSpec: BundleSpecification,
                startTime: number,
                endTime: number,
                unlimitedDeletions: boolean,
                numDeletions: number) {
        super(id,
            name,
            expired,
            expiredAt,
            type,
            option,
            deletable,
            sessions,
            customer,
            bundleSpec,
            startTime,
            endTime,
            unlimitedDeletions,
            numDeletions);
    }

    getPrice() {
        return this.option.price;
    }

    isActive(): boolean {
        return true;
    }

}


export class CourseBundle extends Bundle {

    bundleSpec: CourseBundleSpecification;

    constructor(id: number,
                name: string,
                expired: boolean,
                expiredAt: Date,
                type: string,
                option: Option,
                deletable: boolean,
                sessions: Session[],
                customer: User,
                bundleSpec: BundleSpecification,
                startTime: number,
                endTime: number,
                unlimitedDeletions: boolean,
                numDeletions: number) {
        super(id,
            name,
            expired,
            expiredAt,
            type,
            option,
            deletable,
            sessions,
            customer,
            bundleSpec,
            startTime,
            endTime,
            unlimitedDeletions,
            numDeletions);
    }

    getPrice() {
        return this.option.price;
    }

    isActive(): boolean {
        return !!this.startTime;
    }

}
