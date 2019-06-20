package it.gym.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import it.gym.hateoas.TrainingBundleSpecificationAssembler;
import it.gym.hateoas.TrainingBundleSpecificationResource;
import it.gym.model.ATrainingBundleSpecification;
import it.gym.service.TrainingBundleSpecificationService;
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
    private TrainingBundleSpecificationService service;
    @Autowired
    private ObjectMapper objectMapper;

    @DeleteMapping("/{id}")
    ResponseEntity<TrainingBundleSpecificationResource> delete(@PathVariable Long id) {
        ATrainingBundleSpecification bundle = service.findById(id);
        service.deleteById(id);
        return ResponseEntity.ok(new TrainingBundleSpecificationAssembler().toResource(bundle));
    }

    @GetMapping(path = "/{id}")
    ResponseEntity<TrainingBundleSpecificationResource> findById(@PathVariable Long id) {
        ATrainingBundleSpecification spec = service.findById(id);
        return ResponseEntity.ok(new TrainingBundleSpecificationAssembler().toResource(spec));
    }

    @PostMapping
    ResponseEntity<TrainingBundleSpecificationResource> post(@RequestBody ATrainingBundleSpecification spec) {
        spec = service.createBundle(spec);
        return ResponseEntity.ok(new TrainingBundleSpecificationAssembler().toResource(spec));
    }

    @PatchMapping(path = "/{id}")
    ResponseEntity<TrainingBundleSpecificationResource> patch(@PathVariable Long id,
                                                              HttpServletRequest request) throws IOException {
        ATrainingBundleSpecification spec = service.findById(id);
        spec = objectMapper.readerForUpdating(spec).readValue(request.getReader());
        spec = service.save(spec);
        return ResponseEntity.ok(new TrainingBundleSpecificationAssembler().toResource(spec));
    }

    @GetMapping
    @ResponseBody
    Page<ATrainingBundleSpecification> findAll(Pageable pageable) {
        return service.findAll(pageable);
    }

    @GetMapping(path = "/search")
    @ResponseBody
    Page<ATrainingBundleSpecification> search(@RequestParam String query, Pageable pageable) {
        return service.findByNameContains(query, pageable);
    }

    @GetMapping(path = "/searchNotDisabled")
    @ResponseBody
    Page<ATrainingBundleSpecification> searchNotDisabled(@RequestParam String query, Pageable pageable) {
        return service.findByNameContainsAndIsDisabled(query, false, pageable);
    }

    @GetMapping(path = "/getNotDisabled")
    @ResponseBody
    Page<ATrainingBundleSpecification> getNotDisabled(Pageable pageable) {
        return service.findByIsDisabled(false, pageable);
    }
}
