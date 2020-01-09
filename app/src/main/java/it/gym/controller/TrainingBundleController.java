package it.gym.controller;

import it.gym.hateoas.TrainingBundleAssembler;
import it.gym.hateoas.TrainingBundleResource;
import it.gym.model.ATrainingBundle;
import it.gym.model.CourseTrainingBundle;
import it.gym.service.TrainingBundleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RepositoryRestController
@RequestMapping("/bundles")
@PreAuthorize("isAuthenticated()")
public class TrainingBundleController {

    @Autowired
    private TrainingBundleService service;

    @GetMapping("/courses")
    ResponseEntity<List<TrainingBundleResource>> findCoursesByLargerInterval(@DateTimeFormat(pattern = "dd-MM-yyyy_HH:mm")
                                                                             @RequestParam Date startTime,
                                                                             @DateTimeFormat(pattern = "dd-MM-yyyy_HH:mm")
                                                                             @RequestParam Date endTime) {

        List<CourseTrainingBundle> courses = service.findCoursesLargerThanInterval(startTime, endTime);

        return ResponseEntity.ok(new TrainingBundleAssembler().toResources(courses));
    }

    @GetMapping
    @ResponseBody
    Page<ATrainingBundle> findAll(Pageable pageable) {
        return service.findAll(pageable);
    }

    @GetMapping(path = "/{id}")
    ResponseEntity<TrainingBundleResource> findById(@PathVariable Long id) {
        ATrainingBundle bundle = service.findById(id);
        return ResponseEntity.ok(new TrainingBundleAssembler().toResource(bundle));
    }

    @GetMapping("/search")
    @ResponseBody
    Page<ATrainingBundle> findBySpecs(@RequestParam Long specId, Pageable pageable) {
        return service.findBundlesBySpecId(specId, pageable);
    }
}
