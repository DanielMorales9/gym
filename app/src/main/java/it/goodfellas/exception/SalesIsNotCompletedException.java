package it.goodfellas.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)

public class SalesIsNotCompletedException extends RuntimeException {
    public SalesIsNotCompletedException(Long saleId) {
        super("Sale is not completed " + saleId);
    }
}
