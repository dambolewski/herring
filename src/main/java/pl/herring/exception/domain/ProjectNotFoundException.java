package pl.herring.exception.domain;

public class ProjectNotFoundException extends Exception{
    public ProjectNotFoundException(String message){
        super(message);
    }
}
