package it.gym.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class DuplicateUserException extends RuntimeException {
    public DuplicateUserException(String email) {
        super("The following email already exists: " + email + ".");
    }

    public DuplicateUserException() {
        super( "There is already an account registered with that email");
    }
}
