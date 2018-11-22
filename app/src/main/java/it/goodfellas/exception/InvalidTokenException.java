package it.goodfellas.exception;

public class InvalidTokenException extends RuntimeException {

    public InvalidTokenException() {
        super("Invalid Token Exception");
    }
}
