package it.gym.controller;

import it.gym.facade.TrainingSessionFacade;
import it.gym.hateoas.TrainingSessionAssembler;
import it.gym.hateoas.TrainingSessionResource;
import it.gym.model.ATrainingSession;
import java.util.Date;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@PreAuthorize("isAuthenticated()")
@RequestMapping("/trainingSessions")
public class TrainingSessionController {

  @Autowired private TrainingSessionFacade facade;

  @GetMapping(path = "/{id}")
  @ResponseBody
  public ResponseEntity<TrainingSessionResource> findById(
      @PathVariable Long id) {

    ATrainingSession s = facade.findById(id);

    return new ResponseEntity<>(
        new TrainingSessionAssembler().toModel(s), HttpStatus.OK);
  }

  @GetMapping("/{sessionId}/workouts")
  @ResponseBody
  public ResponseEntity<String> assign(
      @PathVariable Long sessionId, @RequestParam Long workoutId) {
    facade.assign(sessionId, workoutId);
    return new ResponseEntity<>(HttpStatus.OK);
  }

  @DeleteMapping("/{sessionId}/workouts")
  @ResponseBody
  public ResponseEntity<String> remove(
      @PathVariable Long sessionId, @RequestParam Long workoutId) {
    facade.remove(sessionId, workoutId);
    return new ResponseEntity<>(HttpStatus.OK);
  }

  @GetMapping
  @ResponseBody
  public Page<TrainingSessionResource> getSessionsByCustomer(
      @RequestParam Long customerId,
      @RequestParam(required = false)
          @DateTimeFormat(
              pattern = "dd-MM-yyyy",
              iso = DateTimeFormat.ISO.DATE_TIME)
          Date date,
      Pageable pageable) {
    return facade
        .findByCustomer(customerId, date, pageable)
        .map(TrainingSessionResource::new);
  }
}
