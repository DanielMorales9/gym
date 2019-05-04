package it.gym.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class InvalidTimesOff extends RuntimeException {

    public InvalidTimesOff(String message) {
        super(message);
    }

}