import {Option} from "./option.class";
import {CanDelete, CanDisable, CanEdit} from "./policy.interface";

export abstract class BundleSpecification implements CanDelete, CanEdit, CanDisable {
    id: number;
    name: string;
    description: string;
    disabled: boolean;
    createdAt: Date;
    unlimitedDeletions: boolean;
    numDeletions: number;
    options: Option[];
    type: string;

    constructor(id?: number,
                name?: string,
                description?: string,
                disabled?: boolean,
                createdAt?: Date,
                unlimitedDeletions?: boolean,
                numDeletions?: number,
                options?: Option[],
                type?: string) {
        this.id = id
        this.name = name
        this.description = description
        this.disabled = disabled
        this.createdAt = createdAt
        this.unlimitedDeletions = unlimitedDeletions
        this.numDeletions = numDeletions
        this.options = options
        this.type = type
    }

    getName(): string {
        return 'bundleSpec'
    }

    canDelete(): boolean {
        return true
    }

    canEdit(): boolean {
        return true;
    }

    canDisable(): boolean {
        return true;
    }

    canCreate(): boolean {
        return true;
    }
}

export class PersonalBundleSpecification extends BundleSpecification {
}

export class CourseBundleSpecification extends BundleSpecification {
    maxCustomers: number;

    constructor(id?: number,
                name?: string,
                description?: string,
                disabled?: boolean,
                createdAt?: Date,
                unlimitedDeletions?: boolean,
                numDeletions?: number,
                options?: Option[],
                type?: string,
                maxCustomers?: number) {
        super(id,
            name,
            description,
            disabled,
            createdAt,
            unlimitedDeletions,
            numDeletions,
            options,
            type)
        this.maxCustomers = maxCustomers;
    }
}

export enum BundleSpecificationType {
    PERSONAL = 'P',
    COURSE = 'C'
}