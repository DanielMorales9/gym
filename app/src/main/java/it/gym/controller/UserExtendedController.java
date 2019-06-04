package it.gym.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import it.gym.exception.UserNotFoundException;
import it.gym.hateoas.AUserAssembler;
import it.gym.hateoas.AUserResource;
import it.gym.model.AUser;
import it.gym.repository.UserRepository;
import it.gym.repository.VerificationTokenRepository;
import org.hibernate.annotations.GeneratorType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.webmvc.BasePathAwareController;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.Optional;

@RepositoryRestController
@RequestMapping("/users")
public class UserExtendedController {

    private static final Logger logger = LoggerFactory.getLogger(UserExtendedController.class);
    private final UserRepository repository;


    @Autowired
    public UserExtendedController(UserRepository repository) {
        this.repository = repository;
    }

    @GetMapping(path = "/search")
    @ResponseBody
    @PreAuthorize("hasAnyAuthority('ADMIN', 'TRAINER')")
    Page<AUser> searchByLastName(@RequestParam String query, Pageable pageable) {
        logger.info("Query: " + query);
        return repository.findByLastName(query, pageable);
    }

    @GetMapping(path = "findByEmail")
    @PreAuthorize("isAuthenticated()")
    ResponseEntity<AUserResource> findByEmail(@RequestParam String email) {
        logger.info("Query: " + email);
        return ResponseEntity.ok(new AUserAssembler().toResource(repository.findByEmail(email)));
    }

}
