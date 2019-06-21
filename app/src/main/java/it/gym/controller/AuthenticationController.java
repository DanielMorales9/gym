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
@PreAuthorize("isAuthenticated()")
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

    @PostMapping("/confirmRegistration")
    @PreAuthorize("isAnonymous()")
    ResponseEntity<AUserResource> confirmRegistration(@RequestBody Credentials credentials) {
        logger.info("About to verify password for user");
        AUser user = facade.confirmRegistration(credentials.getEmail(), credentials.getPassword());
        return new ResponseEntity<>(new AUserAssembler().toResource(user), HttpStatus.OK);
    }

    @PostMapping("/forgotPassword/{id}")
    @PreAuthorize("isAnonymous()")
    ResponseEntity<AUserResource> changePassword(@PathVariable Long id, @RequestBody PasswordForm form) {
        AUser user = this.facade.changePassword(id, form);
        return new ResponseEntity<>(new AUserAssembler().toResource(user), HttpStatus.OK);
    }

    @GetMapping(path = "/getUserFromVerificationToken")
    ResponseEntity<AUserResource> getUserFromVerificationToken(@RequestParam String token) {
        AUser user = this.facade.getUserFromVerificationToken(token);
        return new ResponseEntity<>(new AUserAssembler().toResource(user), HttpStatus.OK);
    }

    @GetMapping(path = "/forgotPassword")
    @PreAuthorize("isAnonymous()")
    ResponseEntity<AUserResource> forgotPassword(@RequestParam String email) {
        AUser user = facade.forgotPassword(email);
        return new ResponseEntity<>(new AUserAssembler().toResource(user), HttpStatus.OK);
    }

    @GetMapping(path = "/resendAnonymousToken")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity resendAnonymousToken(@RequestParam("id") Long id) {
        AUser user = facade.resendAnonymousToken(id);
        return new ResponseEntity<>(new AUserAssembler().toResource(user), HttpStatus.OK);
    }

    @GetMapping(path = "/resendToken")
    @PreAuthorize("isAnonymous()")
    public ResponseEntity resendToken(@RequestParam("token") String existingToken) {
        AUser user = facade.resendToken(existingToken);
        return new ResponseEntity<>(new AUserAssembler().toResource(user), HttpStatus.OK);
    }

}
