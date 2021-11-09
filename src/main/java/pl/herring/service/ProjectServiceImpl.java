package pl.herring.service;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.herring.constant.ProjectConstant;
import pl.herring.exception.domain.*;
import pl.herring.model.Project;
import pl.herring.model.User;
import pl.herring.repository.ProjectRepository;
import pl.herring.repository.UserRepository;

import static org.apache.commons.lang3.StringUtils.isBlank;
import static pl.herring.constant.ProjectConstant.*;
import static pl.herring.constant.UserConstant.NO_USER_FOUND_BY_USERNAME;

import java.util.Date;
import java.util.List;

@Slf4j
@AllArgsConstructor
@Service
@Transactional
public class ProjectServiceImpl implements ProjectService {
    private UserRepository userRepository;
    private ProjectRepository projectRepository;

    @Override
    public Project findProjectByTitle(String title) {
        return projectRepository.findByTitle(title);
    }

    @Override
    public Project saveProject(String title, String creator) {
        Project project = new Project(title);
        project.setUuid(generateUuid());
        project.setCreationDate(new Date());
        project.setCreator(creator);
        project.setTrackFlag(false);
        return projectRepository.save(project);
    }

    @Override
    public void addUserToProject(String title, String username) throws ProjectNotFoundException, UserNotFoundException, NoTitleNorUsernameException {
        User user = userRepository.findByUsername(username);
        Project project = projectRepository.findByTitle(title);
        validateUserToProject(title, username);
        project.getUsers().add(user);
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

    private String generateUuid() {
        return RandomStringUtils.randomNumeric(5);
    }
}
