package pl.herring.service;

import pl.herring.exception.domain.*;
import pl.herring.model.Project;
import pl.herring.model.Task;

import java.util.List;

public interface ProjectService {
    Project findProjectByTitle(String title);
    Project saveProject(String title, String creator) throws NoTitleException, ProjectAlreadyExist;
    void addUserToProject(String title, String username) throws ProjectNotFoundException, ProjectAlreadyContainsUserException, UserNotFoundException, NoTitleNorUsernameException;
    Project getProject(String title);
    List<Project> getProjects();
    void deleteProject(String title);
    Project updateProject(String currentTitle, String newTitle, String newDescription, String newCreator, boolean newTrackFlag) throws ProjectNotFoundException, NoTitleException, UsernameExistException;
    void deleteUserFromProject(String title, String username);
    void saveTaskGroup(String projectTitle, String taskGroupTitle) throws NoProjectNorTaskGroupException, ProjectNotFoundException;
    void deleteTaskGroup(String title, String id);
    void saveTask(String taskGroupTitle, String taskTitle);
    void deleteTask(String taskGroupID, String taskID);
    Task updateTask(String taskID, boolean isDone);
}
