import {Bundle, CourseBundle, PersonalBundle} from "../model";

export function toBundle(obj: Object): Bundle {
    if (obj['type'] == 'C') {
        return new CourseBundle(
            obj['id'],
            obj['name'],
            obj['expired'],
            obj['expiredAt'],
            obj['type'],
            obj['option'],
            obj['deletable'],
            obj['sessions'],
            obj['customer'],
            obj['bundleSpec'],
            obj['startTime'],
            obj['endTime'],);
    }
    else {
        return new PersonalBundle(
            obj['id'],
            obj['name'],
            obj['expired'],
            obj['expiredAt'],
            obj['type'],
            obj['option'],
            obj['deletable'],
            obj['sessions'],
            obj['customer'],
            obj['bundleSpec']);
    }
}