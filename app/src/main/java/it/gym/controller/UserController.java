package it.gym.controller;

import it.gym.facade.UserFacade;
import it.gym.model.Image;
import it.gym.model.Role;
import it.gym.pojo.UserDTO;
import java.io.IOException;
import java.util.List;
import java.util.zip.DataFormatException;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/users")
@PreAuthorize("isAuthenticated()")
public class UserController {

  @Autowired private UserFacade facade;

  @GetMapping
  @ResponseBody
  public Page<UserDTO> get(Pageable pageable) {
    return facade.findAll(pageable);
  }

  @GetMapping(path = "/{id}")
  public ResponseEntity<UserDTO> get(@PathVariable Long id) {
    UserDTO user = facade.findUserById(id);
    return ResponseEntity.ok(user);
  }

  @GetMapping(path = "/{id}/roles")
  List<Role> getRoles(@PathVariable Long id) {
    return facade.getUserRolesById(id);
  }

  @DeleteMapping(path = "/{id}")
  @PreAuthorize("hasAuthority('ADMIN')")
  public ResponseEntity<UserDTO> delete(@PathVariable Long id) {
    UserDTO user = facade.deleteUserById(id);
    return ResponseEntity.ok(user);
  }

  @PatchMapping(path = "/{id}")
  public ResponseEntity<UserDTO> patch(
      @PathVariable Long id, HttpServletRequest request) throws IOException {
    UserDTO u = facade.patchUser(id, request);
    return ResponseEntity.ok(u);
  }

  @PostMapping("/{id}/image")
  public ResponseEntity<UserDTO> uploadImage(
      @PathVariable("id") Long id,
      @RequestParam("imageFile") MultipartFile file)
      throws IOException {
    UserDTO u = facade.uploadImage(id, file);
    return ResponseEntity.ok(u);
  }

  @GetMapping("/{id}/image")
  public ResponseEntity<Image> getImage(@PathVariable("id") Long id)
      throws DataFormatException, IOException {
    Image u = facade.retrieveImage(id);
    return ResponseEntity.ok(u);
  }

  @GetMapping(path = "/findByEmail")
  public ResponseEntity<UserDTO> findByEmail(@RequestParam String email) {
    UserDTO user = facade.findByEmail(email);
    return ResponseEntity.ok(user);
  }

  @GetMapping(path = "/search")
  @ResponseBody
  @PreAuthorize("hasAnyAuthority('ADMIN', 'TRAINER')")
  public Page<UserDTO> searchByLastName(
      @RequestParam String query, Pageable pageable) {
    return facade.findByName(query, pageable);
  }

  @GetMapping(path = "/events")
  @ResponseBody
  @PreAuthorize("hasAnyAuthority('ADMIN', 'TRAINER')")
  public List<UserDTO> findUserPerEvent(@RequestParam Long eventId) {
    return facade.findUserByEventId(eventId);
  }
}
