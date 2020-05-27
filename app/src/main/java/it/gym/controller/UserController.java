package it.gym.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import it.gym.facade.UserFacade;
import it.gym.hateoas.*;
import it.gym.model.AUser;
import it.gym.model.Image;
import it.gym.model.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.hateoas.CollectionModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.List;
import java.util.zip.DataFormatException;

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
        return ResponseEntity.ok(new AUserAssembler().toModel(user));
    }

    @GetMapping(path = "/{id}/roles")
    ResponseEntity<CollectionModel<RoleResource>> getRoles(@PathVariable Long id) {
        AUser user = facade.findById(id);
        List<Role> roles = user.getRoles();
        return ResponseEntity.ok(new RoleAssembler().toCollectionModel(roles));
    }

    @DeleteMapping(path = "/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<AUserResource> delete(@PathVariable Long id) {
        AUser user = facade.delete(id);
        return ResponseEntity.ok(new AUserAssembler().toModel(user));
    }

    @PatchMapping(path = "/{id}")
    public ResponseEntity<AUserResource> patch(@PathVariable Long id, HttpServletRequest request) throws IOException {
        AUser u = facade.findById(id);
        u = objectMapper.readerForUpdating(u).readValue(request.getReader());
        u = facade.save(u);
        return ResponseEntity.ok(new AUserAssembler().toModel(u));
    }

    @PostMapping("/{id}/image")
    public ResponseEntity<AUserResource> uploadImage(@PathVariable("id") Long id,
                                                     @RequestParam("imageFile") MultipartFile file)
            throws IOException {
        AUser u = facade.uploadImage(id, file);
        return ResponseEntity.ok(new AUserAssembler().toModel(u));
    }

    @GetMapping("/{id}/image")
    public ResponseEntity<ImageResource> getImage(@PathVariable("id") Long id) throws DataFormatException, IOException {
        Image u = facade.retrieveImage(id);
        return ResponseEntity.ok(new ImageAssembler().toModel(u));
    }

    @GetMapping(path = "/findByEmail")
    public ResponseEntity<AUserResource> findByEmail(@RequestParam String email) {
        AUser user = facade.findByEmail(email);
        return ResponseEntity.ok(new AUserAssembler().toModel(user));
    }

    @GetMapping(path = "/search")
    @ResponseBody
    @PreAuthorize("hasAnyAuthority('ADMIN', 'TRAINER')")
    public Page<AUser> searchByLastName(@RequestParam String query, Pageable pageable) {
        return facade.findByName(query, pageable);
    }

    @GetMapping(path = "/events")
    @ResponseBody
    @PreAuthorize("hasAnyAuthority('ADMIN', 'TRAINER')")
    public ResponseEntity<CollectionModel<AUserResource>> findUserPerEvent(@RequestParam Long eventId) {
        List<AUser> user = facade.findUserByEventId(eventId);
        return ResponseEntity.ok(new AUserAssembler().toCollectionModel(user));

    }


}
