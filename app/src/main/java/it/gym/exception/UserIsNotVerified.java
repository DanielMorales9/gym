package it.gym.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class UserIsNotVerified extends RuntimeException {

    public UserIsNotVerified(Long id) {
        super("L'utente con id " + id + " non è stato verificato!");
    }

    public UserIsNotVerified(String email) {
        super("L'utente con email " + email + " non è stato verificato!");
    }
}
