package it.gym.controller;

import it.gym.facade.WorkoutFacade;
import it.gym.model.Workout;
import java.io.IOException;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@PreAuthorize("hasAnyAuthority('ADMIN', 'TRAINER')")
@RequestMapping("/workouts")
public class WorkoutController {

  private final WorkoutFacade facade;

  public WorkoutController(WorkoutFacade facade) {
    this.facade = facade;
  }

  @GetMapping(path = "/{id}")
  @ResponseBody
  public ResponseEntity<Workout> findById(@PathVariable Long id) {

    Workout w = facade.findById(id);

    return ResponseEntity.ok(w);
  }

  @GetMapping
  @ResponseBody
  public Page<Workout> findAll(Pageable pageable) {
    return facade.findAll(pageable);
  }

  @GetMapping(path = "/tags")
  @ResponseBody
  public List<String> getTags() {
    return facade.getTags();
  }

  @PostMapping
  @ResponseBody
  public ResponseEntity<Workout> create(@RequestBody Workout w) {
    w = facade.save(w);
    return new ResponseEntity<>(w, HttpStatus.OK);
  }

  @DeleteMapping(path = "/{id}")
  @ResponseBody
  public ResponseEntity<String> delete(@PathVariable Long id) {
    facade.deleteById(id);
    return new ResponseEntity<>(HttpStatus.OK);
  }

  @PatchMapping("/{id}")
  @ResponseBody
  public ResponseEntity<Workout> update(
      @PathVariable Long id, HttpServletRequest request) throws IOException {

    Workout w = facade.patch(id, request);
    return ResponseEntity.ok(w);
  }

  @GetMapping("/search")
  @ResponseBody
  public Page<Workout> search(
      @RequestParam(required = false) String name,
      @RequestParam(required = false) String tag,
      @RequestParam(required = false) Boolean isTemplate,
      Pageable pageable) {
    return facade.search(name, tag, isTemplate, pageable);
  }
}
