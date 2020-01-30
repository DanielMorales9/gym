package it.gym.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import it.gym.facade.TrainingBundleSpecificationFacade;
import it.gym.hateoas.TrainingBundleSpecificationAssembler;
import it.gym.hateoas.TrainingBundleSpecificationResource;
import it.gym.model.ATrainingBundleSpecification;
import it.gym.model.TimeOption;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.List;

@RepositoryRestController
@RequestMapping("/bundleSpecs")
@PreAuthorize("isAuthenticated()")
public class TrainingBundleSpecificationController {

    @Autowired
    private TrainingBundleSpecificationFacade facade;

    @Autowired
    private ObjectMapper objectMapper;

    @DeleteMapping("/{id}")
    public ResponseEntity<TrainingBundleSpecificationResource> delete(@PathVariable Long id) {
        ATrainingBundleSpecification specs = facade.findById(id);
        facade.delete(specs);
        return ResponseEntity.ok(new TrainingBundleSpecificationAssembler().toResource(specs));
    }

    @GetMapping(path = "/{id}")
    public ResponseEntity<TrainingBundleSpecificationResource> findById(@PathVariable Long id) {
        ATrainingBundleSpecification spec = facade.findById(id);
        return ResponseEntity.ok(new TrainingBundleSpecificationAssembler().toResource(spec));
    }

    @PostMapping
    public ResponseEntity<TrainingBundleSpecificationResource> post(@RequestBody ATrainingBundleSpecification spec) {
        ATrainingBundleSpecification s = facade.createTrainingBundleSpecification(spec);
        return ResponseEntity.ok(new TrainingBundleSpecificationAssembler().toResource(s));
    }

    @PostMapping(path = "/{id}/options")
    public ResponseEntity<TrainingBundleSpecificationResource> createOption(@PathVariable Long id,
                                                                            @RequestBody TimeOption option) {
        ATrainingBundleSpecification s = facade.createOptionToBundleSpec(id, option);
        return ResponseEntity.ok(new TrainingBundleSpecificationAssembler().toResource(s));
    }


    @DeleteMapping(value = "/{id}/options/{optionId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<TrainingBundleSpecificationResource> deleteOption(@PathVariable Long id, @PathVariable Long optionId) {
        ATrainingBundleSpecification b = this.facade.deleteOption(id, optionId);
        return new ResponseEntity<>(new TrainingBundleSpecificationAssembler().toResource(b), HttpStatus.OK);
    }

    @PatchMapping(path = "/{id}")
    public ResponseEntity<TrainingBundleSpecificationResource> patch(@PathVariable Long id,
                                                              HttpServletRequest request) throws IOException {
        ATrainingBundleSpecification spec = facade.findById(id);
        spec = objectMapper.readerForUpdating(spec).readValue(request.getReader());
        spec = facade.save(spec);
        return ResponseEntity.ok(new TrainingBundleSpecificationAssembler().toResource(spec));
    }

    @GetMapping
    @ResponseBody
    public Page<ATrainingBundleSpecification> findAll(Pageable pageable) {
        return facade.findAll(pageable);
    }

    @GetMapping(path = "/search")
    @ResponseBody
    public Page<ATrainingBundleSpecification> search(@RequestParam(required = false) String name,
                                                     @RequestParam(required = false) Boolean disabled,
                                                     Pageable pageable) {
        return facade.findByNameContains(name, disabled, pageable);
    }

    @GetMapping(path = "/list")
    @ResponseBody
    public List<ATrainingBundleSpecification> list(@RequestParam(required = false) Boolean disabled) {
        return facade.findByIsDisabled(disabled);
    }
}
