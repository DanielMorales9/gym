package it.gym.exception;


import it.gym.model.AUser;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)
public class UserRegistrationException extends RuntimeException {

    public UserRegistrationException(AUser user) {
        super(String.format("Non è stato possibile registrare l'utente %s %s.",
                user.getFirstName(),
                user.getLastName()));
    }

    public UserRegistrationException(String message) {
        super(message);
    }
}
