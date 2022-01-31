package pl.herring.service;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.herring.exception.domain.*;
import pl.herring.model.Project;
import pl.herring.model.Task;
import pl.herring.model.TaskGroup;
import pl.herring.model.User;
import pl.herring.repository.ProjectRepository;
import pl.herring.repository.TaskGroupRepository;
import pl.herring.repository.TaskRepository;
import pl.herring.repository.UserRepository;

import javax.mail.MessagingException;

import static org.apache.commons.lang3.StringUtils.isBlank;
import static pl.herring.constant.ProjectConstant.*;
import static pl.herring.constant.TaskConstant.NO_TASK_TITLE;
import static pl.herring.constant.TaskGroupConstant.NO_TASKGROUP_TITLE;
import static pl.herring.constant.TaskGroupConstant.NO_TASK_NOR_TG;
import static pl.herring.constant.UserConstant.NO_USER_FOUND_BY_USERNAME;

import java.util.*;

@Slf4j
@AllArgsConstructor
@Service
@Transactional
public class ProjectServiceImpl implements ProjectService {
    private UserRepository userRepository;
    private ProjectRepository projectRepository;
    private TaskGroupRepository taskGroupRepository;
    public TaskRepository taskRepository;
    private EmailService emailService;

    @Override
    public Project findProjectByTitle(String title) {
        return projectRepository.findByTitle(title);
    }

    @Override
    public Project saveProject(String title, String creator) throws NoTitleException, ProjectAlreadyExist {
        String temp = title.replaceFirst("^\\s*", "");
        validateNewProject(temp);
        Project project = new Project(temp);
        project.setUuid(generateUuid());
        project.setDescription("Simple Description");
        project.setCreationDate(new Date());
        project.setCreator(creator);
        project.setTrackFlag(false);
        return projectRepository.save(project);
    }

    @Override
    public void addUserToProject(String title, String username) throws ProjectNotFoundException, UserNotFoundException, NoTitleNorUsernameException, MessagingException {
        User user = userRepository.findByUsername(username);
        Project project = projectRepository.findByTitle(title);
        validateUserToProject(title, username);
        project.getUsers().add(user);
        if(!Objects.equals(user.getUsername(), project.getCreator())){
            emailService.sendInformationAddedToProject(username, title);
        }
    }


    @Override
    public void deleteUserFromProject(String title, String username) throws MessagingException {
        Project project = projectRepository.findByTitle(title);
        User user = userRepository.findByUsername(username);
        project.getUsers().remove(user);
        emailService.sendInformationDeletedFromProject(username, title);
    }

    @Override
    public void saveTaskGroup(String projectTitle, String taskGroupTitle) throws NoProjectNorTaskGroupException, ProjectNotFoundException, NoTaskGroupTitleException {
        String temp = taskGroupTitle.replaceFirst("^\\s*", "");
        validateTaskGroupToProject(projectTitle, temp);
        Project project = projectRepository.findByTitle(projectTitle);
        project.addTaskGroup(new TaskGroup(temp));
    }

    @Override
    public void deleteTaskGroup(String title, String id) {
        Project project = projectRepository.findByTitle(title);
        Optional<TaskGroup> optional = taskGroupRepository.findById(Long.valueOf(id));
        TaskGroup taskGroup = optional.get();
        project.deleteTaskGroup(taskGroup);
    }

    @Override
    public void saveTask(String taskGroupID, String taskTitle) throws NoTaskTitleNorTaskGroupTitle, NoTaskTitleException {
        validateTaskToTaskGroup(taskTitle, taskGroupID);
        Optional<TaskGroup> optional = taskGroupRepository.findById(Long.valueOf(taskGroupID));
        TaskGroup taskGroup = optional.get();
        taskGroup.addTask(new Task(taskTitle));
    }

    @Override
    public void deleteTask(String taskGroupID, String taskID){
        Optional<TaskGroup> optional = taskGroupRepository.findById(Long.valueOf(taskGroupID));
        Optional<Task> taskOp = taskRepository.findById(Long.valueOf(taskID));
        TaskGroup taskGroup = optional.get();
        Task task = taskOp.get();
        taskGroup.deleteTask(task);

    }

    @Override
    public Project getProject(String title) {
        return projectRepository.findByTitle(title);
    }

    @Override
    public List<Project> getProjects() {
        return projectRepository.findAll();
    }

    @Override
    public void deleteProject(String title) {
        Project project = projectRepository.findByTitle(title);
        projectRepository.delete(project);
    }

    @Override
    public Project updateProject(String currentTitle, String newTitle, String newDescription, String newCreator, boolean newTrackFlag) throws ProjectNotFoundException, NoTitleException, UsernameExistException {
        Project currentProject = validateProject(currentTitle, newCreator);
        currentProject.setTitle(newTitle);
        currentProject.setDescription(newDescription);
        currentProject.setCreator(newCreator);
        currentProject.setTrackFlag(newTrackFlag);
        projectRepository.save(currentProject);
        return currentProject;
    }

    @Override
    public Task updateTask(String taskID, boolean isDone) {
        Optional<Task> optional = taskRepository.findById(Long.valueOf(taskID));
        Task task = optional.get();
        task.setDone(isDone);
        taskRepository.save(task);
        return task;
    }

    private Project validateProject(String title, String username) throws NoTitleException, ProjectNotFoundException, UsernameExistException {
        Project project = projectRepository.findByTitle(title);
        if (isBlank(title)) {
            throw new NoTitleException(NO_TITLE);
        } else if (project == null) {
            throw new ProjectNotFoundException(PROJECT_NOT_FOUND_EXCEPTION + title);
        } else if (userRepository.findByUsername(username) == null) {
            throw new UsernameExistException(NO_USER_FOUND_BY_USERNAME + username);
        } else {
            return project;
        }
    }

    private Project validateNewProject(String title) throws ProjectAlreadyExist, NoTitleException {
        Project project = projectRepository.findByTitle(title);
        if (projectRepository.findAll().contains(project)) {
            throw new ProjectAlreadyExist(PROJECT_ALREADY_EXIST);
        } else if (isBlank(title)) {
            throw new NoTitleException(NO_TITLE);
        } else {
            return project;
        }
    }

    private void validateTaskToTaskGroup(String taskTitle, String taskGroupID) throws NoTaskTitleNorTaskGroupTitle, NoTaskTitleException {
        Optional<TaskGroup> operational = taskGroupRepository.findById(Long.valueOf(taskGroupID));
        TaskGroup taskGroup = operational.get();
        if(isBlank(taskGroupID)){
            throw new NoTaskTitleNorTaskGroupTitle(NO_TASK_NOR_TG);
        } else if(isBlank(taskTitle)){
            throw new NoTaskTitleException(NO_TASK_TITLE);
        }
        if (!taskGroupRepository.findAll().contains(taskGroup)){
            throw new NoSuchElementException();
        }
    }

    private Project validateUserToProject(String title, String username) throws ProjectNotFoundException, UserNotFoundException, NoTitleNorUsernameException {
        Project project = projectRepository.findByTitle(title);
        User user = userRepository.findByUsername(username);
        if (isBlank(title) || isBlank(username)) {
            throw new NoTitleNorUsernameException(NO_TITLE_NOR_USERNAME);
        }
        if (project == null) {
            throw new ProjectNotFoundException(PROJECT_NOT_FOUND_EXCEPTION + title);
        } else if (user == null) {
            throw new UserNotFoundException(NO_USER_FOUND_BY_USERNAME + username);
        } else if (project.getUsers().contains(user)) {
            throw new ProjectNotFoundException(USER_ASSIGNED_ALREADY);
        } else {
            return null;
        }
    }

    private Project validateTaskGroupToProject(String projectTitle, String taskGroupTitle) throws NoProjectNorTaskGroupException, ProjectNotFoundException, NoTaskGroupTitleException {
        Project project = findProjectByTitle(projectTitle);
        if (isBlank(projectTitle) || isBlank(taskGroupTitle)) {
            throw new NoProjectNorTaskGroupException(NOT_PROJECT_NOR_TASKGROUP);
        } else if (isBlank(taskGroupTitle)) {
                throw new NoTaskGroupTitleException(NO_TASKGROUP_TITLE);
        } else if (project == null) {
            throw new ProjectNotFoundException(PROJECT_NOT_FOUND_EXCEPTION + projectTitle);
        } else {
            return null;
        }
    }

    private String generateUuid() {
        return RandomStringUtils.randomNumeric(5);
    }
}
