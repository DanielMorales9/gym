package it.goodfellas.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class POJONotFoundException extends RuntimeException {

    public POJONotFoundException(String pojoName, Long pojoId) {
        super(String.format("%s with the following %d was not found.", pojoName, pojoId));
    }
}
