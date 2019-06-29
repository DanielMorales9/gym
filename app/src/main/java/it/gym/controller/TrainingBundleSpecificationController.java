package it.gym.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import it.gym.facade.TrainingBundleSpecificationFacade;
import it.gym.hateoas.TrainingBundleSpecificationAssembler;
import it.gym.hateoas.TrainingBundleSpecificationResource;
import it.gym.model.ATrainingBundleSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

@RepositoryRestController
@RequestMapping("/bundleSpecs")
@PreAuthorize("isAuthenticated()")
public class TrainingBundleSpecificationController {

    @Autowired
    private TrainingBundleSpecificationFacade facade;

    @Autowired
    private ObjectMapper objectMapper;

    @DeleteMapping("/{id}")
    ResponseEntity<TrainingBundleSpecificationResource> delete(@PathVariable Long id) {
        ATrainingBundleSpecification specs = facade.findById(id);
        facade.delete(specs);
        return ResponseEntity.ok(new TrainingBundleSpecificationAssembler().toResource(specs));
    }

    @GetMapping(path = "/{id}")
    ResponseEntity<TrainingBundleSpecificationResource> findById(@PathVariable Long id) {
        ATrainingBundleSpecification spec = facade.findById(id);
        return ResponseEntity.ok(new TrainingBundleSpecificationAssembler().toResource(spec));
    }

    @PostMapping
    ResponseEntity<TrainingBundleSpecificationResource> post(@RequestBody ATrainingBundleSpecification spec) {
        spec = facade.createTrainingBundleSpecification(spec);
        return ResponseEntity.ok(new TrainingBundleSpecificationAssembler().toResource(spec));
    }

    @PatchMapping(path = "/{id}")
    ResponseEntity<TrainingBundleSpecificationResource> patch(@PathVariable Long id,
                                                              HttpServletRequest request) throws IOException {
        ATrainingBundleSpecification spec = facade.findById(id);
        spec = objectMapper.readerForUpdating(spec).readValue(request.getReader());
        spec = facade.save(spec);
        return ResponseEntity.ok(new TrainingBundleSpecificationAssembler().toResource(spec));
    }

    @GetMapping
    @ResponseBody
    Page<ATrainingBundleSpecification> findAll(Pageable pageable) {
        return facade.findAll(pageable);
    }

    @GetMapping(path = "/search")
    @ResponseBody
    Page<ATrainingBundleSpecification> search(@RequestParam String query, Pageable pageable) {
        return facade.findByNameContains(query, pageable);
    }

    @GetMapping(path = "/searchNotDisabled")
    @ResponseBody
    Page<ATrainingBundleSpecification> searchNotDisabled(@RequestParam String query, Pageable pageable) {
        return facade.findByNameContainsAndIsDisabled(query, false, pageable);
    }

    @GetMapping(path = "/getNotDisabled")
    @ResponseBody
    Page<ATrainingBundleSpecification> getNotDisabled(Pageable pageable) {
        return facade.findByIsDisabled(false, pageable);
    }
}
