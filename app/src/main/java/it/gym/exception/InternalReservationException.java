package it.gym.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
public class InternalReservationException extends RuntimeException {
    public InternalReservationException(String message) {
        super(message);
    }
}
