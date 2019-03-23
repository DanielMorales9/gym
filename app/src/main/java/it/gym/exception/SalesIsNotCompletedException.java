package it.goodfellas.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class SalesIsNotCompletedException extends RuntimeException {

    public SalesIsNotCompletedException(Long saleId) {
        super(String.format("La vendita (%d) non è stata completata.", saleId));
    }
}
