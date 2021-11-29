package pl.herring.controller;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.herring.exception.domain.*;
import pl.herring.model.HttpResponse;
import pl.herring.model.Project;
import pl.herring.model.UserToProject;
import pl.herring.service.ProjectService;

import java.util.List;

import static org.springframework.http.HttpStatus.OK;
import static pl.herring.constant.ProjectConstant.PROJECT_DELETED_SUCCESSFULLY;

@AllArgsConstructor
@RestController
@RequestMapping(path = {"/herring"})
@CrossOrigin("http://localhost:4200/**")
public class ProjectController extends ExceptionHandling {
    private ProjectService projectService;

    @GetMapping("/project/list")
    public ResponseEntity<List<Project>> getProjects() {
        List<Project> projects = projectService.getProjects();
        return new ResponseEntity<>(projects, OK);
    }

    @PostMapping("/project/save")
    public ResponseEntity<Project> saveProject(@RequestParam("title") String title, @RequestParam("creator") String creator) throws NoTitleException, ProjectAlreadyExist {
        Project newProject = projectService.saveProject(title, creator);
        return new ResponseEntity<>(newProject, OK);
    }

    @PostMapping("/project/addUserToProject")
    public ResponseEntity<?> addUserToProject(@RequestParam("title") String title, @RequestParam("username") String username) throws ProjectNotFoundException, ProjectAlreadyContainsUserException, UserNotFoundException, NoTitleNorUsernameException {
        projectService.addUserToProject(title, username);
        return new ResponseEntity<>(OK, OK);
    }

    @DeleteMapping("/project/delete/{title}")
    public ResponseEntity<HttpResponse> deleteProject(@PathVariable("title") String title) {
        projectService.deleteProject(title);
        return response(OK, PROJECT_DELETED_SUCCESSFULLY);
    }

    private ResponseEntity<HttpResponse> response(HttpStatus httpStatus, String message) {
        return new ResponseEntity<>(new HttpResponse(httpStatus.value(), httpStatus, httpStatus.getReasonPhrase().toUpperCase(), message.toUpperCase()), httpStatus);
    }

    @GetMapping("/project/find/{title}")
    public ResponseEntity<Project> getProject(@PathVariable("title") String title) {
        Project project = projectService.findProjectByTitle(title);
        return new ResponseEntity<>(project, OK);
    }

    @PostMapping("/project/update")
    public ResponseEntity<Project> updateProject(@RequestParam("currentTitle") String currentTitle,
                                                 @RequestParam("title") String title,
                                                 @RequestParam(value = "description", required = false) String description,
                                                 @RequestParam(value = "creator", required = false) String creator,
                                                 @RequestParam("trackFlag") String trackFlag) throws ProjectNotFoundException, NoTitleException, UsernameExistException {
        Project updatedProject = projectService.updateProject(currentTitle, title, description, creator, Boolean.parseBoolean(trackFlag));
        return new ResponseEntity<>(updatedProject, OK);
    }


}
