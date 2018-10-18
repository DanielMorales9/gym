package it.goodfellas.exception;

public class AvailabilityCheckException extends RuntimeException {

    public AvailabilityCheckException(){
        super("Something went wrong while checking availability");
    }

}
