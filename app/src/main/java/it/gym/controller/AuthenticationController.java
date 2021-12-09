package it.gym.controller;

import it.gym.dto.CredentialsDTO;
import it.gym.dto.PasswordFormDTO;
import it.gym.dto.UserDTO;
import it.gym.facade.AuthenticationFacade;
import it.gym.model.AUser;
import javax.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/authentication")
@PreAuthorize("isAuthenticated()")
public class AuthenticationController {

  private static final Logger logger =
      LoggerFactory.getLogger(AuthenticationController.class);

  private final AuthenticationFacade facade;

  public AuthenticationController(AuthenticationFacade facade) {
    this.facade = facade;
  }

  @PostMapping(path = "/registration")
  @PreAuthorize("hasAuthority('ADMIN')")
  public ResponseEntity<UserDTO> registration(@Valid @RequestBody AUser user) {
    UserDTO u = facade.register(user);
    return ResponseEntity.ok(u);
  }

  @PostMapping("/confirmRegistration")
  @PreAuthorize("isAnonymous()")
  public ResponseEntity<UserDTO> confirmRegistration(
      @RequestBody CredentialsDTO credentials) {
    logger.info("About to verify password for user");
    UserDTO user =
        facade.confirmRegistration(
            credentials.getEmail(), credentials.getPassword());
    return new ResponseEntity<>(user, HttpStatus.OK);
  }

  @PostMapping("/changePasswordAnonymous/{id}")
  @PreAuthorize("isAnonymous()")
  public ResponseEntity<UserDTO> changePasswordAnonymous(
      @PathVariable Long id, @RequestBody PasswordFormDTO form) {
    UserDTO user = this.facade.changePassword(id, form);
    return new ResponseEntity<>(user, HttpStatus.OK);
  }

  @PostMapping("/changePassword/{id}")
  public ResponseEntity<UserDTO> changePassword(
      @PathVariable Long id, @RequestBody PasswordFormDTO form) {
    UserDTO user = this.facade.changePassword(id, form);
    return new ResponseEntity<>(user, HttpStatus.OK);
  }

  @GetMapping(path = "/getUserFromVerificationToken")
  @PreAuthorize("isAnonymous()")
  public ResponseEntity<UserDTO> getUserFromVerificationToken(
      @RequestParam String token) {
    UserDTO user = this.facade.getUserFromVerificationToken(token);
    return new ResponseEntity<>(user, HttpStatus.OK);
  }

  @GetMapping(path = "/forgotPassword")
  @PreAuthorize("isAnonymous()")
  public ResponseEntity<UserDTO> forgotPassword(@RequestParam String email) {
    UserDTO user = facade.forgotPassword(email);
    return new ResponseEntity<>(user, HttpStatus.OK);
  }

  @GetMapping(path = "/resendTokenAnonymous")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<UserDTO> resendTokenAnonymous(
      @RequestParam("id") Long id) {
    UserDTO user = facade.resendAnonymousToken(id);
    return new ResponseEntity<>(user, HttpStatus.OK);
  }

  @GetMapping(path = "/resendToken")
  @PreAuthorize("isAnonymous()")
  public ResponseEntity<UserDTO> resendToken(
      @RequestParam("token") String existingToken) {
    UserDTO user = facade.resendToken(existingToken);
    return new ResponseEntity<>(user, HttpStatus.OK);
  }
}
