package it.goodfellas.exception;

import it.goodfellas.model.AUser;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.BAD_REQUEST)
public class UserVerifiedException extends RuntimeException {

    public UserVerifiedException(AUser user) {
        super(String.format("L'utente %s %s è già stato verificato", user.getFirstName(), user.getLastName()));
    }
}
