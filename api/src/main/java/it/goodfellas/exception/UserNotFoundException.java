package it.goodfellas.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)

public class UserNotFoundException extends RuntimeException {

    public UserNotFoundException(Long userId) {
        super("Could not find AUser " + userId + ".");
    }

    public UserNotFoundException(String email) {
        super("Could not find AUser with the following email" + email + ".");
    }
}
