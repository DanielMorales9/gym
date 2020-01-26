export enum BundleSpecificationType {
    PERSONAL =  'P',
    COURSE = 'C'
}

export enum BundleType {
    PERSONAL =  'P',
    COURSE = 'C'
}

export class Option {
    id: number;
    name: string;
    number: number;
    price: number;
    createdAt: Date;
}

export abstract class BundleSpecification {
    id: number;
    name: string;
    description: string;
    disabled: boolean;
    type: string;

    constructor() {

    }
}

export class PersonalBundleSpecification extends BundleSpecification {
    numSessions: number;
    price: number

    constructor() {
        super();
        this.type = BundleSpecificationType.PERSONAL;
    }
}

export class CourseBundleSpecification extends BundleSpecification {
    options: Option[];

    constructor() {
        super();
        this.type = BundleSpecificationType.COURSE;
    }
}

export abstract class Bundle {
    id: number;
    name: string;
    expired: boolean;
    type: string;

    constructor() {

    }
}

export class PersonalBundle extends Bundle {

    bundleSpec: PersonalBundleSpecification;

    constructor() {
        super();
        this.type = BundleType.PERSONAL;
    }
}

export class CourseBundle extends Bundle {

    bundleSpec: CourseBundleSpecification;
    startTime: number;
    endTime: number;

    constructor() {
        super();
        this.type = BundleType.COURSE;
    }
}
