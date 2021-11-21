import {BundlePurchaseOption, OnDemandPurchaseOption, Option, TimePurchaseOption} from '../model';

export function mapToOption(obj: Object): Option {
    if (obj['type'] === 'T') {
        return new TimePurchaseOption(
            obj['id'],
            obj['name'],
            obj['number'],
            obj['price'],
            obj['createdAt'],
            obj['type']
        );
    }
    else if (obj['type'] === 'B') {
        return new BundlePurchaseOption(
            obj['id'],
            obj['name'],
            obj['number'],
            obj['price'],
            obj['createdAt'],
            obj['type']
        );
    }
    else {
        return new OnDemandPurchaseOption(
            obj['id'],
            obj['name'],
            obj['number'],
            obj['price'],
            obj['createdAt'],
            obj['type']
        );
    }
}
