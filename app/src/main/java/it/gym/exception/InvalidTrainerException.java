package it.gym.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)

public class InvalidTrainerException extends RuntimeException {
    public InvalidTrainerException(String trainerEmail, String authEmail) {
        super("Invalid trainer exception, expect trainer with email "
                + trainerEmail + " but is "+ authEmail);
    }
}
