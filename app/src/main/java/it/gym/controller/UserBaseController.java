package it.gym.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import it.gym.exception.UserNotFoundException;
import it.gym.hateoas.AUserAssembler;
import it.gym.hateoas.AUserResource;
import it.gym.model.AUser;
import it.gym.repository.UserRepository;
import it.gym.repository.VerificationTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.BasePathAwareController;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.Optional;

@BasePathAwareController
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

    @RequestMapping(path = "users/{id}", method = RequestMethod.PATCH)
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
