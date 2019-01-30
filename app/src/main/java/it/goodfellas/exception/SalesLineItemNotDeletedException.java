package it.goodfellas.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)

public class SalesLineItemNotDeletedException extends RuntimeException {

    public SalesLineItemNotDeletedException(Long saleId, Long lineId) {
        super("Impossibile eliminate riga con id " + lineId + " della vendita con id " + saleId);
    }
}
