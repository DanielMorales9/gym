export enum BundleSpecificationType {
    PERSONAL =  'P',
    COURSE = 'C'
}

export enum BundleType {
    PERSONAL =  'P',
    COURSE = 'C'
}

export abstract class BundleSpecification {
    id: number;
    name: string;
    price: number;
    description: string;
    disabled: boolean;
    type: string;

    constructor() {

    }
}

export class PersonalBundleSpecification extends BundleSpecification {
    numSessions: number;

    constructor() {
        super();
        this.type = BundleSpecificationType.PERSONAL;
    }
}

export class CourseBundleSpecification extends BundleSpecification {
    startTime: number;
    endTime: number;
    maxCustomers: number;

    constructor() {
        super();
        this.type = BundleSpecificationType.COURSE;
    }
}

export abstract class Bundle {
    id: number;
    name: string;
    price: number;
    description: string;
    disabled: boolean;
    expired: boolean;
    type: string;

    constructor() {

    }
}

export class PersonalBundle extends Bundle {

    bundleSpec: PersonalBundleSpecification;
    numSessions: number;

    constructor() {
        super();
        this.type = BundleType.PERSONAL;
    }
}

export class CourseBundle extends Bundle {

    bundleSpec: CourseBundleSpecification;
    startTime: number;
    endTime: number;
    maxCustomers: number;

    constructor() {
        super();
        this.type = BundleType.COURSE;
    }
}
