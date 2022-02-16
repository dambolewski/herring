package pl.herring.service;

import org.springframework.web.multipart.MultipartFile;
import pl.herring.exception.domain.*;
import pl.herring.model.Project;
import pl.herring.model.Task;

import javax.mail.MessagingException;
import java.io.IOException;
import java.util.List;

public interface ProjectService {
    Project findProjectByTitle(String title);

    Project saveProject(String title, String creator) throws NoTitleException, ProjectAlreadyExist;

    void addUserToProject(String title, String username) throws ProjectNotFoundException, ProjectAlreadyContainsUserException, UserNotFoundException, NoTitleNorUsernameException, MessagingException;

    Project getProject(String title);

    List<Project> getProjects();

    void deleteProject(String title);

    List<Project> getUserProjects(String username);

    Project updateProject(String currentTitle, String newTitle, String newDescription, String newCreator, boolean newTrackFlag) throws ProjectNotFoundException, NoTitleException, UsernameExistException;

    void deleteUserFromProject(String title, String username) throws MessagingException;

    void saveTaskGroup(String projectTitle, String taskGroupTitle) throws NoProjectNorTaskGroupException, ProjectNotFoundException, NoTaskGroupTitleException;

    void deleteTaskGroup(String title, String id);

    void saveTask(String taskGroupTitle, String taskTitle) throws NoTaskTitleNorTaskGroupTitle, NoTaskTitleException;

    void deleteTask(String taskGroupID, String taskID);

    Task updateTask(String taskID, boolean isDone);

    void addAttachment(String title, MultipartFile image) throws IOException, NotAnImageFileException;

    void deleteAttachment(String title, String id);

    void addActivity(String projectTitle, String username);

    void addActivity(String projectTitle, String username, String taskGroupTitle);

    void addActivity(String projectTitle, String username, String taskGroupTitle, String taskTitle);

}
