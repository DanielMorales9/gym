export enum BundleSpecificationType {
    PERSONAL =  'P',
    COURSE = 'C'
}

export enum BundleTypeConstant {
    PERSONAL =  'P',
    COURSE = 'C'
}

export enum BundleEntity {
    P =  'personal',
    C = 'course'
}

export enum OptionType {
    B = 'Pacchetto',
    T = 'A Tempo',
    D = 'A Consumo'
}

export enum BundleType {
    P = 'Allenamento Personalizzato',
    C = 'Corso'
}

export class Option {
    id: number;
    name: string;
    number: number;
    price: number;
    createdAt: Date;
    type: string;
}

export abstract class BundleSpecification {
    id: number;
    name: string;
    description: string;
    disabled: boolean;
    type: string;
    options: Option[];

    constructor() {

    }
}

export class Workout {
    id: number;
    name: string;
    description: string;
    tag1: string;
    tag2: string;
    tag3: string;
    template: boolean;
    createdAt: Date;
    updatedAt: Date;

    constructor() {

    }
}



export class PersonalBundleSpecification extends BundleSpecification {
    constructor() {
        super();
        this.type = BundleSpecificationType.PERSONAL;
    }
}

export class CourseBundleSpecification extends BundleSpecification {
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
    option: Option;


    protected constructor() {
    }

    public abstract getPrice();
}

export class PersonalBundle extends Bundle {

    bundleSpec: PersonalBundleSpecification;

    constructor() {
        super();
        this.type = BundleTypeConstant.PERSONAL;
    }

    getPrice() {
        return this.option.price;
    }
}

export class CourseBundle extends Bundle {

    bundleSpec: CourseBundleSpecification;
    startTime: number;
    endTime: number;

    constructor() {
        super();
        this.type = BundleTypeConstant.COURSE;
    }

    getPrice() {
        return this.option.price;
    }
}
