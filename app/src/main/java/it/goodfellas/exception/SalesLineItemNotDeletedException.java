package it.goodfellas.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)

public class SalesLineItemNotDeletedException extends RuntimeException {

    public SalesLineItemNotDeletedException(Long saleId, Long lineId) {
        super("Unable to delete the line with id " + lineId + " of sale with id " + saleId);
    }
}
