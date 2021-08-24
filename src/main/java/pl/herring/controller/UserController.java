package pl.herring.controller;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pl.herring.exception.domain.*;
import pl.herring.model.HttpResponse;
import pl.herring.model.User;
import pl.herring.model.UserPrincipal;
import pl.herring.service.UserService;
import pl.herring.utility.JwtTokenProvider;

import javax.mail.MessagingException;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

import static org.springframework.http.HttpStatus.NO_CONTENT;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.MediaType.IMAGE_JPEG_VALUE;
import static pl.herring.constant.EmailConstant.*;
import static pl.herring.constant.FileConstant.*;
import static pl.herring.constant.SecurityConstant.JWT_TOKEN_HEADER;
import static pl.herring.constant.UserConstant.*;

@AllArgsConstructor
@RestController
@RequestMapping(path = {"/", "/herring"})
@CrossOrigin("http://localhost:4200/**")
public class UserController extends ExceptionHandling {
    private UserService userService;
    private AuthenticationManager authenticationManager;
    private JwtTokenProvider jwtTokenProvider;

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody User user) {
        authenticate(user.getUsername(), user.getPassword());
        User loginUser = userService.findUserByUsername(user.getUsername());
        UserPrincipal userPrincipal = new UserPrincipal(loginUser);
        HttpHeaders jwtHeader = getJwtHeader(userPrincipal);
        return new ResponseEntity<>(loginUser, jwtHeader, OK);
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) throws EmailExistException, UsernameExistException, MessagingException {
        User newUser = userService.register(user.getFirstName(), user.getLastName(), user.getUsername(), user.getEmail());
        return new ResponseEntity<>(newUser, OK);
    }

    @PreAuthorize("hasAnyAuthority('user:create')")
    @PostMapping("/add")
    public ResponseEntity<User> addNewUser(@RequestParam("firstName") String firstName,
                                           @RequestParam("lastName") String lastName,
                                           @RequestParam("username") String username,
                                           @RequestParam("email") String email,
                                           @RequestParam("role") String role,
                                           @RequestParam("isActive") String isActive,
                                           @RequestParam("isNonLocked") String isNonLocked,
                                           @RequestParam(value = "profileImage", required = false) MultipartFile profileImage) throws EmailExistException, IOException, UsernameExistException, MessagingException, UserNotFoundException {
        User newUser = userService.addNewUser(firstName, lastName, username, email, role, Boolean.parseBoolean(isNonLocked), Boolean.parseBoolean(isActive), profileImage);
        return new ResponseEntity<>(newUser, OK);
    }

    @PreAuthorize("hasAnyAuthority('user:update')")
    @PostMapping("/update")
    public ResponseEntity<User> updateUser(@RequestParam("currentUsername") String currentUsername,
                                           @RequestParam("firstName") String firstName,
                                           @RequestParam("lastName") String lastName,
                                           @RequestParam("username") String username,
                                           @RequestParam("email") String email,
                                           @RequestParam("role") String role,
                                           @RequestParam("isActive") String isActive,
                                           @RequestParam("isNonLocked") String isNonLocked,
                                           @RequestParam(value = "profileImage", required = false) MultipartFile profileImage) throws EmailExistException, IOException, UsernameExistException {
        User updatedUser = userService.updateUser(currentUsername, firstName, lastName, username, email, role, Boolean.parseBoolean(isNonLocked), Boolean.parseBoolean(isActive), profileImage);
        return new ResponseEntity<>(updatedUser, OK);
    }

    @GetMapping("/find/{username}")
    public ResponseEntity<User> getUser(@PathVariable("username") String username) {
        User user = userService.findUserByUsername(username);
        return new ResponseEntity<>(user, OK);
    }

    @GetMapping("/find/list")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getUsers();
        return new ResponseEntity<>(users, OK);
    }

    @GetMapping("/resetPassword/{email}")
    public ResponseEntity<HttpResponse> resetPassword(@PathVariable("email") String email) throws EmailNotFoundException, MessagingException {
        userService.resetPassword(email);
        return response(OK, EMAIL_WITH_NEW_PASSWORD_SENT + email);
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasAnyAuthority('user:delete')")
    public ResponseEntity<HttpResponse> deleteUser(@PathVariable("id") Long id) {
        userService.deleteUser(id);
        return response(NO_CONTENT, USER_DELETED_SUCCESSFULLY);
    }

    @PostMapping("/updateProfileImage")
    public ResponseEntity<User> updateProfileImage(@RequestParam("username") String username,
                                                   @RequestParam(value = "profileImage") MultipartFile profileImage) throws EmailExistException, IOException, UsernameExistException {
        User user = userService.updateProfileImage(username, profileImage);
        return new ResponseEntity<>(user, OK);
    }

    @GetMapping(path = "user/image/{username}/{fileName}", produces = IMAGE_JPEG_VALUE)
    public byte[] getProfileImage(@PathVariable("username") String username,
                                  @PathVariable("fileName") String fileName) throws IOException {
        return Files.readAllBytes(Paths.get(USER_FOLDER + username + FORWARD_SLASH + fileName));
    }

    @GetMapping(path = "user/image/profile/{username}", produces = IMAGE_JPEG_VALUE)
    public byte[] getTempProfileImage(@PathVariable("username") String username) throws IOException {
        URL url = new URL(TEMP_PROFILE_IMAGE_BASE_URL + username);
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        try (InputStream inputStream = url.openStream()) {
            int bytesRead;
            byte[] chunk = new byte[1024];
            while ((bytesRead = inputStream.read(chunk)) > 0) {
                byteArrayOutputStream.write(chunk, 0, bytesRead);
            }
        }
        return byteArrayOutputStream.toByteArray();
    }


    private ResponseEntity<HttpResponse> response(HttpStatus httpStatus, String message) {
        return new ResponseEntity<>(new HttpResponse(httpStatus.value(), httpStatus, httpStatus.getReasonPhrase().toUpperCase(), message.toUpperCase()), httpStatus);
    }

    private HttpHeaders getJwtHeader(UserPrincipal userPrincipal) {
        HttpHeaders headers = new HttpHeaders();
        headers.add(JWT_TOKEN_HEADER, jwtTokenProvider.generateJwtToken(userPrincipal));
        return headers;
    }

    private void authenticate(String username, String password) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
    }
}
