package it.gym.controller;

import it.gym.hateoas.TrainingSessionAssembler;
import it.gym.hateoas.TrainingSessionResource;
import it.gym.model.ATrainingSession;
import it.gym.service.TrainingSessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@PreAuthorize("isAuthenticated()")
@RequestMapping("/sessions")
public class TrainingSessionController {

    @Autowired
    private TrainingSessionService service;

    @GetMapping(path = "/{id}")
    @ResponseBody
    public ResponseEntity<TrainingSessionResource> findById(@PathVariable Long id) {

        ATrainingSession s = service.findById(id);

        return new ResponseEntity<>(new TrainingSessionAssembler().toResource(s), HttpStatus.OK);
    }


}
