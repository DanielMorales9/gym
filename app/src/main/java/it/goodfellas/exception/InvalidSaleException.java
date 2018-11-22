package it.goodfellas.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class InvalidSaleException extends RuntimeException {
    public InvalidSaleException(String s, Long id) {
        super(String.format(s, id));
    }

    public InvalidSaleException(String s, String lastName) {
        super(String.format(s, lastName));
    }
}
