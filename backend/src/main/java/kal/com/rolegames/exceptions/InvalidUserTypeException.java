package kal.com.rolegames.exceptions;

public class InvalidUserTypeException extends RuntimeException {
    public InvalidUserTypeException(String message) {
        super(message);
    }

    public InvalidUserTypeException(String message, Throwable cause) {
        super(message, cause);
    }
}