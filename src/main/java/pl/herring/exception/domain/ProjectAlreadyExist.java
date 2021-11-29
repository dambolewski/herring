package pl.herring.exception.domain;

public class ProjectAlreadyExist extends Exception{
    public ProjectAlreadyExist(String message) {
        super(message);
    }
}
