package it.goodfellas.exception;

public class InvalidVerificationLink extends RuntimeException {
    public InvalidVerificationLink(String verifyLink) {
        super("Invalid Verification Link " + verifyLink);
    }
}
