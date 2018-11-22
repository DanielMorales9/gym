package it.goodfellas.exception;

public class NotAllowedException extends RuntimeException {

    public NotAllowedException() {
        super("Non è permesso");
    }
    public NotAllowedException(String message) {
        super(message);
    }
}
