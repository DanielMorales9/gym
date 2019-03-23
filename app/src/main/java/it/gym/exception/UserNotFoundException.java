package it.gym.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class UserNotFoundException extends RuntimeException {

    public UserNotFoundException(Long userId) {
        super(String.format("L'utente con id %d non è stato trovato.", userId));
    }

    public UserNotFoundException(String email) {
        super(String.format("L'utente con email %s non è stato trovato.", email));
    }
}
