package pl.herring.service;

import pl.herring.model.Project;

import java.util.List;

public interface ProjectService {
    Project saveProject(Project project);
    void addUserToProject(String title, String username);
    Project getProject(String title);
    List<Project> getProjects();
}
