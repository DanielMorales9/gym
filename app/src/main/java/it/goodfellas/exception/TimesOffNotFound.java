package it.goodfellas.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class TimesOffNotFound extends RuntimeException {
    public TimesOffNotFound(String message) {
        super(message);
    }
}
