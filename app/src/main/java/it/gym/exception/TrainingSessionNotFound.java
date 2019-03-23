package it.goodfellas.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class TrainingSessionNotFound extends RuntimeException {
    public TrainingSessionNotFound(String message) {
        super(message);
    }
}
