package it.goodfellas.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class InvalidSaleException extends RuntimeException {

    public InvalidSaleException(String message) {
        super(message);
    }
}
