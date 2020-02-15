package it.gym.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import it.gym.facade.UserFacade;
import it.gym.hateoas.*;
import it.gym.model.AUser;
import it.gym.model.Gym;
import it.gym.model.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/users")
@PreAuthorize("isAuthenticated()")
public class UserController {

    @Autowired
    private UserFacade facade;
    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping
    @ResponseBody
    public Page<AUser> get(Pageable pageable) {
        return facade.findAll(pageable);
    }

    @GetMapping(path = "/{id}")
    public ResponseEntity<AUserResource> get(@PathVariable Long id) {
        AUser user = facade.findById(id);
        return ResponseEntity.ok(new AUserAssembler().toResource(user));
    }

    @GetMapping(path = "/{id}/roles")
    ResponseEntity<List<RoleResource>> getRoles(@PathVariable Long id) {
        AUser user = facade.findById(id);
        List<Role> roles = user.getRoles();
        return ResponseEntity.ok(new RoleAssembler().toResources(roles));
    }

    @DeleteMapping(path = "/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<AUserResource> delete(@PathVariable Long id) {
        AUser user = facade.delete(id);
        return ResponseEntity.ok(new AUserAssembler().toResource(user));
    }

    @PatchMapping(path = "/{id}")
    public ResponseEntity<AUserResource> patch(@PathVariable Long id, HttpServletRequest request) throws IOException {
        AUser u = facade.findById(id);
        u = objectMapper.readerForUpdating(u).readValue(request.getReader());
        u = facade.save(u);
        return ResponseEntity.ok(new AUserAssembler().toResource(u));
    }

    @GetMapping(path = "/findByEmail")
    public ResponseEntity<AUserResource> findByEmail(@RequestParam String email) {
        AUser user = facade.findByEmail(email);
        return ResponseEntity.ok(new AUserAssembler().toResource(user));
    }

    @GetMapping(path = "/search")
    @ResponseBody
    @PreAuthorize("hasAnyAuthority('ADMIN', 'TRAINER')")
    public Page<AUser> searchByLastName(@RequestParam String query, Pageable pageable) {
        return facade.findByLastName(query, pageable);
    }

    @GetMapping(path = "/events")
    @ResponseBody
    @PreAuthorize("hasAnyAuthority('ADMIN', 'TRAINER')")
    public ResponseEntity<List<AUserResource>> findUserPerEvent(@RequestParam Long eventId) {
        List<AUser> user = facade.findUserByEventId(eventId);
        return ResponseEntity.ok(new AUserAssembler().toResources(user));

    }


}
