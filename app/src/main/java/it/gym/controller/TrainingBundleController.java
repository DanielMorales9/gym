package it.gym.controller;

import it.gym.facade.TrainingBundleFacade;
import it.gym.hateoas.TrainingBundleAssembler;
import it.gym.hateoas.TrainingBundleResource;
import it.gym.hateoas.TrainingBundleSpecificationAssembler;
import it.gym.hateoas.TrainingBundleSpecificationResource;
import it.gym.model.ATrainingBundle;
import it.gym.model.ATrainingBundleSpecification;
import it.gym.model.CourseTrainingBundle;
import it.gym.pojo.CourseBundle;
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
    private TrainingBundleFacade service;

    @GetMapping("/courses")
    ResponseEntity<List<TrainingBundleResource>> findCoursesByLargerInterval(@DateTimeFormat(pattern = "dd-MM-yyyy_HH:mm")
                                                                             @RequestParam Date startTime,
                                                                             @DateTimeFormat(pattern = "dd-MM-yyyy_HH:mm")
                                                                             @RequestParam Date endTime) {

        List<CourseTrainingBundle> courses = service.findCoursesLargerThanInterval(startTime, endTime);

        return ResponseEntity.ok(new TrainingBundleAssembler().toResources(courses));
    }

    @PostMapping
    ResponseEntity<TrainingBundleResource> post(@RequestBody CourseBundle params) {
        ATrainingBundle bundle = service.createTrainingBundle(params);
        return ResponseEntity.ok(new TrainingBundleAssembler().toResource(bundle));
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

    @DeleteMapping(path = "/{id}")
    ResponseEntity<TrainingBundleResource> delete(@PathVariable Long id) {
        ATrainingBundle bundle = service.deleteById(id);
        return ResponseEntity.ok(new TrainingBundleAssembler().toResource(bundle));
    }

    @GetMapping("/search")
    @ResponseBody
    Page<ATrainingBundle> findBySpecs(@RequestParam Long specId, Pageable pageable) {
        return service.findBundlesBySpecId(specId, pageable);
    }
}
