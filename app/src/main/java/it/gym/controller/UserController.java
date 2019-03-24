package it.gym.controller;

import it.gym.exception.TimesOffNotFound;
import it.gym.exception.UnAuthorizedException;
import it.gym.exception.UserNotFoundException;
import it.gym.hateoas.AUserAssembler;
import it.gym.hateoas.AUserResource;
import it.gym.hateoas.TimeOffAssembler;
import it.gym.hateoas.TimeOffResource;
import it.gym.model.AUser;
import it.gym.model.Admin;
import it.gym.model.TimeOff;
import it.gym.model.VerificationToken;
import it.gym.repository.UserRepository;
import it.gym.repository.VerificationTokenRepository;
import it.gym.utility.MailSenderUtility;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UserController {

    private final static Logger logger = LoggerFactory.getLogger(UserController.class);
    private final UserRepository repository;
    private final VerificationTokenRepository tokenRepository;

    @Autowired
    public UserController(UserRepository repository, 
                          VerificationTokenRepository tokenRepository) {
        this.repository = repository;
        this.tokenRepository = tokenRepository;
    }

    @GetMapping(path = "/search")
    @ResponseBody
    Page<AUser> search(@RequestParam String query, Pageable pageable) {
        logger.info("Query: " + query);
        return repository.findByLastName(query, pageable);
    }

    @GetMapping(path = "/findByEmail")
    ResponseEntity<AUserResource> search(@RequestParam String email) {
        logger.info("Query: " + email);
        return ResponseEntity.ok(new AUserAssembler().toResource(repository.findByEmail(email)));
    }


    @DeleteMapping(path = "/{id}")
    @Transactional
    ResponseEntity<AUserResource> delete(@PathVariable Long id) {
        Optional<AUser> user = this.repository.findById(id);
        if (user.isPresent()) {
            this.tokenRepository.deleteByUser_Id(id);
            this.repository.deleteById(id);
        }
        else {
            throw new UserNotFoundException(id);
        }
        AUser u = user.get();
        return ResponseEntity.ok(new AUserAssembler().toResource(u));
    }

}
