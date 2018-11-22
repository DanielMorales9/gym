package it.goodfellas.controller;

import it.goodfellas.exception.UserNotFoundException;
import it.goodfellas.hateoas.AUserAssembler;
import it.goodfellas.hateoas.AUserResource;
import it.goodfellas.model.AUser;
import it.goodfellas.repository.RoleRepository;
import it.goodfellas.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Optional;

@RepositoryRestController
public class UserController {

    private final static Logger logger = LoggerFactory.getLogger(UserController.class);
    private final UserRepository repository;
    private final RoleRepository roleRepository;

    @Autowired
    public UserController(UserRepository repository, RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
        this.repository = repository;
    }

    @GetMapping(path = "/users/search")
    @ResponseBody
    Page<AUser> search(@RequestParam String query, Pageable pageable) {
        logger.info("Query: " + query);
        return repository.findByLastName(query, pageable);
    }

    @GetMapping(path = "/users/findByEmail")
    ResponseEntity<AUserResource> search(@RequestParam String email) {
        logger.info("Query: " + email);
        return ResponseEntity.ok(new AUserAssembler().toResource(repository.findByEmail(email)));
    }


    @GetMapping(path = "/users/{userId}/roles/{roleId}")
    @Transactional
    ResponseEntity<AUserResource> addRole(@PathVariable Long userId, @PathVariable Long roleId) {
        Optional<AUser> opt = this.repository.findById(userId);
        if(opt.isPresent()) {
            AUser user = opt.get();
            this.roleRepository.findById(roleId).ifPresent(role -> {
                user.addRole(role);
                this.repository.save(user);
            });
            return ResponseEntity.ok(new AUserAssembler().toResource(user));
        }
        else {
            throw new UserNotFoundException(userId);
        }
    }


}
