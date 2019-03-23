package it.gym.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class NotFoundException extends RuntimeException {

    public NotFoundException(String pojoName, Long pojoId) {
        super(String.format("%s con il seguente id %d non è stato trovato.", pojoName, pojoId));
    }
}
