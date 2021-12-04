package pl.herring.exception.domain;

public class NoProjectNorTaskGroupException extends Exception{
    public NoProjectNorTaskGroupException(String message){
        super(message);
    }
}
