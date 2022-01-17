package pl.herring.exception.domain;

public class NoTaskTitleException extends Exception {
    public NoTaskTitleException(String message) {
        super(message);
    }
}
