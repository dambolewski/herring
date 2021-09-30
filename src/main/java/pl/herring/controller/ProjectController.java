package pl.herring.controller;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.herring.model.HttpResponse;
import pl.herring.model.Project;
import pl.herring.model.UserToProject;
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
    public ResponseEntity<?> addUserToProject(@RequestBody UserToProject form){
        projectService.addUserToProject(form.getTitle(),form.getUsername());
        return new ResponseEntity<>(OK);
    }

    @DeleteMapping("/project/delete/{title}")
    public ResponseEntity<HttpResponse> deleteProject(@PathVariable("title") String title) {
        projectService.deleteProject(title);
        return response(OK, "Project Deleted Successfully.");
    }

    private ResponseEntity<HttpResponse> response(HttpStatus httpStatus, String message) {
        return new ResponseEntity<>(new HttpResponse(httpStatus.value(), httpStatus, httpStatus.getReasonPhrase().toUpperCase(), message.toUpperCase()), httpStatus);
    }
}