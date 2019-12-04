package it.gym.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import it.gym.hateoas.TrainingBundleAssembler;
import it.gym.hateoas.TrainingBundleResource;
import it.gym.hateoas.TrainingBundleSpecificationAssembler;
import it.gym.hateoas.TrainingBundleSpecificationResource;
import it.gym.model.ATrainingBundle;
import it.gym.model.ATrainingBundleSpecification;
import it.gym.model.CourseTrainingBundle;
import it.gym.service.TrainingBundleService;
import it.gym.service.TrainingBundleSpecificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.Date;
import java.util.List;

@RepositoryRestController
@RequestMapping("/bundles")
@PreAuthorize("isAuthenticated()")
public class TrainingBundleController {

    @Autowired
    private TrainingBundleService service;

    @GetMapping("/courses")
    ResponseEntity<List<TrainingBundleResource>> findCoursesByLargerInterval(@DateTimeFormat(pattern="dd-MM-yyyy_HH:mm")
                                                                             @RequestParam Date startTime,
                                                                             @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm")
                                                                             @RequestParam Date endTime) {

        List<CourseTrainingBundle> courses = service.findCoursesLargerThanInterval(startTime, endTime);

        return ResponseEntity.ok(new TrainingBundleAssembler().toResources(courses));
    }
}
