package pl.herring.exception.domain;

public class NoTitleNorUsernameException extends Exception {
    public NoTitleNorUsernameException(String message) {
        super(message);
    }
}
