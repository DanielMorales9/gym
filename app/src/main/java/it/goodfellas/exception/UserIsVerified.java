package it.goodfellas.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class UserIsVerified extends RuntimeException {
    public UserIsVerified(Long id) {
        super("L'utente con id " + id + " è già stato verificato!");
    }
    public UserIsVerified(String email) {
        super("L'utente con email " + email + " è già stato verificato!");
    }
}
