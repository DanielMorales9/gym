package it.gym.exception;

import it.gym.model.AUser;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class TokenNotFoundException extends RuntimeException {

    public TokenNotFoundException() {
        super("Il token non esiste");
    }

}
