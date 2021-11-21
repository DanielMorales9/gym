import {Bundle} from './bundle.class';
import {BundleSpecification} from './bundleSpecification.class';

export class SaleLineItem {

    id: number;
    bundleSpecification: BundleSpecification;
    trainingBundle: Bundle;
    price:  number;

    constructor() {
    }
}
