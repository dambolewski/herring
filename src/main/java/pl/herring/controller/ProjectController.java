package pl.herring.controller;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pl.herring.exception.domain.*;
import pl.herring.model.*;
import pl.herring.service.ProjectService;

import javax.mail.MessagingException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.MediaType.IMAGE_JPEG_VALUE;
import static pl.herring.constant.FileConstant.*;
import static pl.herring.constant.ProjectConstant.ACTIVITY_ADDED;
import static pl.herring.constant.ProjectConstant.PROJECT_DELETED_SUCCESSFULLY;
import static pl.herring.constant.TaskConstant.TASK_ADDED_SUCCESSFULLY;
import static pl.herring.constant.TaskConstant.TASK_DELETED_SUCCESSFULLY;
import static pl.herring.constant.TaskGroupConstant.TASKGROUP_ADDED_SUCCESSFULLY;

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

    @GetMapping("/project/{username}")
    public ResponseEntity<List<Project>> getUserProjects(@PathVariable("username") String username) {
        List<Project> projects = projectService.getUserProjects(username);
        return new ResponseEntity<>(projects, OK);
    }

    @PostMapping("/project/save")
    public ResponseEntity<Project> saveProject(@RequestParam("title") String title, @RequestParam("creator") String creator) throws NoTitleException, ProjectAlreadyExist {
        Project newProject = projectService.saveProject(title, creator);
        return new ResponseEntity<>(newProject, OK);
    }

    @PostMapping("/project/addUserToProject")
    public ResponseEntity<?> addUserToProject(@RequestParam("title") String title, @RequestParam("username") String username) throws ProjectNotFoundException, ProjectAlreadyContainsUserException, UserNotFoundException, NoTitleNorUsernameException, MessagingException {
        projectService.addUserToProject(title, username);
        return new ResponseEntity<>(OK, OK);
    }

    @PostMapping("/project/deleteUserFromProject")
    public ResponseEntity<?> deleteUserFromProject(@RequestParam("title") String title, @RequestParam("username") String username) throws MessagingException {
        projectService.deleteUserFromProject(title, username);
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
                                                 @RequestParam("trackFlag") String trackFlag,
                                                 @RequestParam("done") String done) throws ProjectNotFoundException, NoTitleException, UsernameExistException {
        Project updatedProject = projectService.updateProject(currentTitle, title, description, creator, Boolean.parseBoolean(trackFlag), Boolean.parseBoolean(done));
        return new ResponseEntity<>(updatedProject, OK);
    }

    @PostMapping("/project/updateTaskGroup")
    public ResponseEntity<TaskGroup> updateTaskGroup(@RequestParam("taskGroupId") String taskGroupId,
                                                     @RequestParam("done") String done) {
        TaskGroup updatedTaskGroup = projectService.updateTaskGroup(taskGroupId, Boolean.parseBoolean(done));
        return new ResponseEntity<>(updatedTaskGroup, OK);
    }

    @PostMapping("/project/updateTask")
    public ResponseEntity<Task> updateTask(@RequestParam("taskID") String taskID,
                                           @RequestParam("isDone") String isDone) {
        Task updatedTask = projectService.updateTask(taskID, Boolean.parseBoolean(isDone));
        return new ResponseEntity<>(updatedTask, OK);
    }

    @PostMapping("/project/saveTaskGroup")
    public ResponseEntity<HttpResponse> saveTaskGroup(@RequestParam("title") String projectTitle, @RequestParam("tgTitle") String taskGroupTitle) throws NoProjectNorTaskGroupException, ProjectNotFoundException, NoTaskGroupTitleException {
        projectService.saveTaskGroup(projectTitle, taskGroupTitle);
        return response(OK, TASKGROUP_ADDED_SUCCESSFULLY);
    }

    @DeleteMapping("/project/deleteTaskGroup/{title}/{id}")
    public ResponseEntity<HttpResponse> deleteTaskGroup(@PathVariable("title") String title, @PathVariable("id") String id) {
        projectService.deleteTaskGroup(title, id);
        return response(OK, PROJECT_DELETED_SUCCESSFULLY);
    }

    @PostMapping("/project/saveTask")
    public ResponseEntity<HttpResponse> saveTask(@RequestParam("taskGroupID") String taskGroupID, @RequestParam("tTitle") String tTitle) throws NoTaskTitleNorTaskGroupTitle, NoTaskTitleException {
        projectService.saveTask(taskGroupID, tTitle);
        return response(OK, TASK_ADDED_SUCCESSFULLY);
    }

    @DeleteMapping("/project/deleteTask/{taskGroupID}/{id}")
    public ResponseEntity<HttpResponse> deleteTask(@PathVariable("taskGroupID") String taskGroupID, @PathVariable("id") String id) {
        projectService.deleteTask(taskGroupID, id);
        return response(OK, TASK_DELETED_SUCCESSFULLY);
    }

    @PostMapping("/project/uploadAttachment/{title}")
    public ResponseEntity<HttpResponse> uploadAttachment(@PathVariable("title") String title, @RequestParam("file") MultipartFile file) throws IOException, NotAnImageFileException {
        projectService.addAttachment(title, file);
        return response(OK, ATTACHMENT_ADDED_TO_PROJECT);
    }

    @GetMapping(path = "/project/image/{title}/{fileName}", produces = IMAGE_JPEG_VALUE)
    public byte[] getProfileImage(@PathVariable("title") String title,
                                  @PathVariable("fileName") String fileName) throws IOException {
        return Files.readAllBytes(Paths.get(PROJECT_FOLDER + title + FORWARD_SLASH + fileName));
    }

    @DeleteMapping("/project/deleteAttachment/{title}/{id}")
    public ResponseEntity<HttpResponse> deleteAttachment(@PathVariable("title") String title, @PathVariable("id") String id) {
        projectService.deleteAttachment(title, id);
        return response(OK, ATTACHMENT_DELETED);
    }

    @PostMapping("/project/uploadActivity")
    public ResponseEntity<HttpResponse> uploadActivity(@RequestParam("title") String title, @RequestParam("username") String username, @RequestParam(value = "taskGroupID", required = false) String taskGroupID, @RequestParam(value = "taskID", required = false) String taskID) {
        if (taskGroupID == null && taskID == null)
            projectService.addActivity(title, username);
        else if (taskID == null)
            projectService.addActivity(title, username, taskGroupID);
        else
            projectService.addActivity(title, username, taskGroupID, taskID);
        return response(OK, ACTIVITY_ADDED);
    }
}
