import {BundleSpecification, CourseBundleSpecification, PersonalBundle, PersonalBundleSpecification} from '../model';
import {mapToOption} from './option.mappers';

export function mapToBundleSpec(obj: Object): BundleSpecification {
    const options = (obj['options'] || []).map(mapToOption);

    if (obj['type'] === 'C') {
        return new CourseBundleSpecification(
            obj['id'],
            obj['name'],
            obj['description'],
            obj['disabled'],
            obj['createdAt'],
            obj['unlimitedDeletions'],
            obj['numDeletions'],
            options,
            obj['type'],
            obj['maxCustomers'],
            );
    }
    else {
        return new PersonalBundleSpecification(
            obj['id'],
            obj['name'],
            obj['description'],
            obj['disabled'],
            obj['createdAt'],
            obj['unlimitedDeletions'],
            obj['numDeletions'],
            options,
            obj['type'],
        );
    }
}
