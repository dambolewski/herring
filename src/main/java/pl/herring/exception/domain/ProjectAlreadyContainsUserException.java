package pl.herring.exception.domain;

public class ProjectAlreadyContainsUserException extends Exception {
    public ProjectAlreadyContainsUserException(String message) {
        super(message);
    }
}
