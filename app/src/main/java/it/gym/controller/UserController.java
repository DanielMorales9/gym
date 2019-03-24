package it.gym.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import it.gym.exception.UserNotFoundException;
import it.gym.hateoas.AUserAssembler;
import it.gym.hateoas.AUserResource;
import it.gym.model.*;
import it.gym.repository.UserRepository;
import it.gym.repository.VerificationTokenRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.Optional;

@RepositoryRestController
@RequestMapping("/users")
public class UserController {

    private final static Logger logger = LoggerFactory.getLogger(UserController.class);
    private final UserRepository repository;
    private final VerificationTokenRepository tokenRepository;
    private final ObjectMapper objectMapper;


    @Autowired
    public UserController(UserRepository repository,
                          VerificationTokenRepository tokenRepository,
                          ObjectMapper objectMapper) {
        this.repository = repository;
        this.tokenRepository = tokenRepository;
        this.objectMapper = objectMapper;
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

    @PatchMapping(path = "/{id}")
    ResponseEntity<AUserResource> patch(@PathVariable Long id, HttpServletRequest request) throws IOException
    {
        Optional<AUser> user = repository.findById(id);
        AUser u;
        if (user.isPresent()){
            u = user.get();
            u = objectMapper.readerForUpdating(u).readValue(request.getReader());
            u = repository.saveAndFlush(u);
        }
        else
            throw new UserNotFoundException(id);

        return ResponseEntity.ok(new AUserAssembler().toResource(u));
    }

}
