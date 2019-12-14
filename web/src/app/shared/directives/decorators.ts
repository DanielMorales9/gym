export function to_promise(target, key, descriptor) {

    // save a reference to the original method this way we keep the values currently in the
    // descriptor and don't overwrite what another decorator might have done to the descriptor.
    if (descriptor === undefined) {
        descriptor = Object.getOwnPropertyDescriptor(target, key);
    }
    const originalMethod = descriptor.value;

    // editing the descriptor/value parameter
    descriptor.value = function () {
        // note usage of originalMethod here
        return originalMethod.apply(this, arguments).toPromise()
            .then(value => [value, undefined])
            .catch(error => [undefined, error]);
    };

    // return edited descriptor as opposed to overwriting the descriptor
    return descriptor;
}
