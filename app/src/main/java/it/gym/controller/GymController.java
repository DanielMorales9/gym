package it.gym.controller;

import it.gym.model.Gym;
import it.gym.pojo.Manifest;
import it.gym.service.GymService;
import java.io.IOException;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/gyms")
public class GymController {

  private final GymService service;

  public GymController(GymService service) {
    this.service = service;
  }

  @GetMapping("/{id}")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<Gym> findGymById(@PathVariable Long id) {
    Gym gym = service.findById(id);
    return ResponseEntity.ok(gym);
  }

  @GetMapping
  public List<Gym> findGyms() {
    return service.findAll();
  }

  @GetMapping("/manifest.webmanifest")
  @ResponseBody
  public Manifest getManifest() {
    return service.getManifest();
  }

  @PatchMapping(path = "/{id}")
  @PreAuthorize("hasAuthority('ADMIN')")
  public ResponseEntity<Gym> patch(
      @PathVariable Long id, HttpServletRequest request) throws IOException {
    Gym gym = service.patch(id, request);
    return ResponseEntity.ok(gym);
  }
}
