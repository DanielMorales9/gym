package it.gym.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class GymNotFoundException extends RuntimeException {
    public GymNotFoundException(String name) {
        super("La palestra "+name+" non esiste");
    }
    public GymNotFoundException(Long id) {
        super("La palestra "+id+" non esiste");
    }
}
