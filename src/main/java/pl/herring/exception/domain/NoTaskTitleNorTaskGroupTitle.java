package pl.herring.exception.domain;

public class NoTaskTitleNorTaskGroupTitle extends Exception {
    public NoTaskTitleNorTaskGroupTitle(String message) {
        super(message);
    }
}
