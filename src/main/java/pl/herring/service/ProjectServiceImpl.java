package pl.herring.service;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.herring.model.Project;
import pl.herring.model.User;
import pl.herring.repository.ProjectRepository;
import pl.herring.repository.UserRepository;

import java.util.List;

@Slf4j
@AllArgsConstructor
@Service
@Transactional
public class ProjectServiceImpl implements ProjectService{
    private UserRepository userRepository;
    private ProjectRepository projectRepository;

    @Override
    public Project saveProject(Project project) {
        log.info("Saving project {} to the database", project.getTitle());
        return projectRepository.save(project);
    }

    @Override
    public void addUserToProject(String title, String username) {
        log.info("Adding user {} to project {}", username, title);
        User user = userRepository.findByUsername(username);
        Project project = projectRepository.findByTitle(title);
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
}
