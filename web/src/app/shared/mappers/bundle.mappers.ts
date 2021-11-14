import {Bundle, CourseBundle, PersonalBundle} from "../model";
import {mapToOption} from "./option.mappers";

export function mapToBundle(obj: Object): Bundle {
    const option = mapToOption(obj['option']);
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
            obj['bundleSpec'],
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
            obj['bundleSpec'],
            obj['unlimitedDeletions'],
            obj['numDeletions'],
        );
    }
}