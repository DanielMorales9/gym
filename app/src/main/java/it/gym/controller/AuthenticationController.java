package it.gym.controller;

import it.gym.facade.AuthenticationFacade;
import it.gym.hateoas.AUserAssembler;
import it.gym.hateoas.AUserResource;
import it.gym.model.AUser;
import it.gym.pojo.Credentials;
import it.gym.pojo.PasswordForm;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/authentication")
public class AuthenticationController {

    private static final Logger logger = LoggerFactory.getLogger(AuthenticationController.class);

    @Autowired
    private AuthenticationFacade facade;

    @PostMapping(path = "/registration")
    @PreAuthorize("hasAuthority('ADMIN')")
    ResponseEntity<AUserResource> registration(@Valid @RequestBody AUser user, @RequestParam Long gymId) {
        user = facade.register(user, gymId);
        return ResponseEntity.ok(new AUserAssembler().toResource(user));

    }

    @PostMapping("/verifyPassword")
    @PreAuthorize("isAnonymous()")
    ResponseEntity<AUserResource> verifyPassword(@RequestBody Credentials credentials) {
        logger.info("About to verify password for user");
        AUser user = facade.confirmRegistration(credentials.getEmail(), credentials.getPassword());
        return new ResponseEntity<>(new AUserAssembler().toResource(user), HttpStatus.OK);
    }

    @PostMapping("/changePassword/{id}")
    @PreAuthorize("isAnonymous()")
    ResponseEntity<AUserResource> changePassword(@PathVariable Long id, @RequestBody PasswordForm form) {
        AUser user = this.facade.changePassword(id, form);
        return new ResponseEntity<>(new AUserAssembler().toResource(user), HttpStatus.OK);
    }

    @GetMapping(path = "/verification")
    ResponseEntity<AUserResource> verification(@RequestParam String token) {
        AUser user = this.facade.getUserFromVerificationToken(token);
        return new ResponseEntity<>(new AUserAssembler().toResource(user), HttpStatus.OK);
    }

    @GetMapping(path = "/findByEmail")
    @PreAuthorize("isAnonymous()")
    ResponseEntity<AUserResource> findByEmail(@RequestParam String email) {
        AUser user = facade.forgotPassword(email);
        return new ResponseEntity<>(new AUserAssembler().toResource(user), HttpStatus.OK);
    }

    @GetMapping(path = "/resendToken/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity resendAnonymousToken(@PathVariable("id") Long id) {
        AUser user = facade.resendAnonymousToken(id);
        return new ResponseEntity<>(new AUserAssembler().toResource(user), HttpStatus.OK);
    }

    @GetMapping(path = "/resendToken")
    @PreAuthorize("isAnonymous()")
    public ResponseEntity resendExpiredToken(@RequestParam("token") String existingToken) {
        AUser user = facade.resendExpiredToken(existingToken);
        return new ResponseEntity<>(new AUserAssembler().toResource(user), HttpStatus.OK);
    }

}
