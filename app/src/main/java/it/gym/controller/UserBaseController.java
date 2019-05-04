package it.gym.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import it.gym.exception.TokenNotFoundException;
import it.gym.exception.UserNotFoundException;
import it.gym.hateoas.AUserAssembler;
import it.gym.hateoas.AUserResource;
import it.gym.model.AUser;
import it.gym.model.VerificationToken;
import it.gym.repository.UserRepository;
import it.gym.repository.VerificationTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.BasePathAwareController;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.Optional;

@BasePathAwareController
@Transactional
public class UserBaseController {

    private final UserRepository repository;
    private final VerificationTokenRepository tokenRepository;
    private final ObjectMapper objectMapper;


    @Autowired
    public UserBaseController(UserRepository repository,
                              VerificationTokenRepository tokenRepository,
                              ObjectMapper objectMapper) {
        this.repository = repository;
        this.tokenRepository = tokenRepository;
        this.objectMapper = objectMapper;
    }


    @RequestMapping(path = "users/{id}", method = RequestMethod.DELETE)
    @PreAuthorize("hasAuthority('ADMIN')")
    ResponseEntity<AUserResource> delete(@PathVariable Long id) {
        Optional<AUser> user = this.repository.findById(id);
        if (user.isPresent()) {
            AUser u = user.get();
            VerificationToken vtk = this.tokenRepository.findByUser(u).orElseThrow(TokenNotFoundException::new);
            this.tokenRepository.delete(vtk);
            this.repository.deleteById(id);
            return ResponseEntity.ok(new AUserAssembler().toResource(u));
        }
        throw new UserNotFoundException(id);
    }

    @RequestMapping(path = "users/{id}", method = RequestMethod.PATCH)
    @PreAuthorize("isAuthenticated()")
    ResponseEntity<AUserResource> patch(@PathVariable Long id, HttpServletRequest request) throws IOException {
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
