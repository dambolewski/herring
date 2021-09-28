package pl.herring.controller;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.herring.model.Project;
import pl.herring.model.User;
import pl.herring.service.ProjectService;

import java.util.List;

import static org.springframework.http.HttpStatus.OK;

@AllArgsConstructor
@RestController
@RequestMapping(path = {"/herring"})
public class ProjectController {
    private ProjectService projectService;

    @GetMapping("/project/list")
    public ResponseEntity<List<Project>> getProjects() {
        List<Project> projects = projectService.getProjects();
        return new ResponseEntity<>(projects, OK);
    }

    @PostMapping("/project/save")
    public ResponseEntity<Project> saveProject(@RequestBody Project project) {
        Project newProject = projectService.saveProject(project);
        return new ResponseEntity<>(newProject, OK);
    }

    @GetMapping("/project/addUserToProject")
    public ResponseEntity<?> addUserToProject(@RequestBody UserToProjectForm form){
        projectService.addUserToProject(form.getTitle(),form.getUsername());
        return new ResponseEntity<>(OK);
    }
}

@Data
class UserToProjectForm {
    private String title;
    private String username;
}