package it.goodfellas.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class CustomerNotFoundException extends RuntimeException {

    public CustomerNotFoundException(Long userId) {
        super("Could not find Customer " + userId + ".");
    }

    public CustomerNotFoundException(String email) {
        super("Could not find Customer with the following email" + email + ".");
    }
}
