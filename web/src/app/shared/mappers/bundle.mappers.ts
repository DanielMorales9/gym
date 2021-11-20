import {Bundle, CourseBundle, PersonalBundle} from '../model';
import {mapToOption} from './option.mappers';
import {mapToBundleSpec} from './bundleSpec.mappers';

export function mapToBundle(obj: Object): Bundle {
    const option = mapToOption(obj['option']);
    const bundleSpec = mapToBundleSpec(obj['bundleSpec']);
    if (obj['type'] == 'C') {
        return new CourseBundle(
            obj['id'],
            obj['name'],
            obj['expired'],
            obj['expiredAt'],
            obj['type'],
            option,
            obj['deletable'],
            obj['sessions'],
            obj['customer'],
            bundleSpec,
            obj['startTime'],
            obj['endTime'],
            obj['unlimitedDeletions'],
            obj['numDeletions'],
            );
    }
    else {
        return new PersonalBundle(
            obj['id'],
            obj['name'],
            obj['expired'],
            obj['expiredAt'],
            obj['type'],
            option,
            obj['deletable'],
            obj['sessions'],
            obj['customer'],
            bundleSpec,
            obj['startTime'],
            obj['endTime'],
            obj['unlimitedDeletions'],
            obj['numDeletions'],
        );
    }
}
