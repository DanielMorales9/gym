package it.goodfellas.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class AdminNotFoundException extends RuntimeException {

    public AdminNotFoundException(Long userId) {
        super("Could not find Admin " + userId + ".");
    }

    public AdminNotFoundException(String email) {
        super("Could not find Admin with the following email" + email + ".");
    }
}
