package it.gym.controller;

import it.gym.facade.WorkoutFacade;
import it.gym.hateoas.WorkoutAssembler;
import it.gym.hateoas.WorkoutResource;
import it.gym.model.Workout;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

@RestController
@PreAuthorize("hasAnyAuthority('ADMIN', 'TRAINER')")
@RequestMapping("/workouts")
public class WorkoutController {

    @Autowired
    private WorkoutFacade facade;

    @GetMapping(path = "/{id}")
    @ResponseBody
    public ResponseEntity<WorkoutResource> findById(@PathVariable Long id) {

        Workout w = facade.findById(id);

        return new ResponseEntity<>(new WorkoutAssembler().toResource(w), HttpStatus.OK);
    }

    @GetMapping
    @ResponseBody
    public Page<Workout> findById(Pageable pageable) {
        return facade.findAll(pageable);
    }

    @PostMapping
    @ResponseBody
    public ResponseEntity<WorkoutResource> create(Workout w) {
         w = facade.save(w);
        return new ResponseEntity<>(new WorkoutAssembler().toResource(w), HttpStatus.OK);
    }

    @DeleteMapping
    @ResponseBody
    public ResponseEntity<String> delete(Long id) {
        facade.deleteById(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PatchMapping("/{id}")
    @ResponseBody
    public ResponseEntity<WorkoutResource> update(@PathVariable Long id, HttpServletRequest request)
            throws IOException {

        Workout w = facade.patch(id, request);
        return ResponseEntity.ok(new WorkoutAssembler().toResource(w));
    }

    @PatchMapping("/search")
    @ResponseBody
    public Page<Workout> search(@RequestParam String query,
                                @RequestParam String filter,
                                @RequestParam Boolean isTemplate,
                                Pageable pageable) {
        return facade.search(query, filter, isTemplate, pageable);
    }

}
