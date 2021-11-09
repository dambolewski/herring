package pl.herring.service;

import pl.herring.exception.domain.*;
import pl.herring.model.Project;

import java.util.List;

public interface ProjectService {
    Project findProjectByTitle(String title);
    Project saveProject(String title, String creator);
    void addUserToProject(String title, String username) throws ProjectNotFoundException, ProjectAlreadyContainsUserException, UserNotFoundException, NoTitleNorUsernameException;
    Project getProject(String title);
    List<Project> getProjects();
    void deleteProject(String title);
    Project updateProject(String currentTitle, String newTitle, String newDescription, String newCreator, boolean newTrackFlag) throws ProjectNotFoundException, NoTitleException, UsernameExistException;
}
