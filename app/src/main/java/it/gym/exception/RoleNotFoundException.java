package it.gym.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class RoleNotFoundException extends RuntimeException {

    public RoleNotFoundException() {
        super("Il ruolo non è stato trovato");

    }

    public RoleNotFoundException(Long roleId) {
        super(String.format("Il ruolo con id %d non è stato trovato", roleId));

    }
}
