package it.gym.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import it.gym.facade.TrainingBundleFacade;
import it.gym.hateoas.SaleResource;
import it.gym.hateoas.TrainingBundleAssembler;
import it.gym.hateoas.TrainingBundleResource;
import it.gym.model.ATrainingBundle;
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

@RepositoryRestController
@RequestMapping("/bundles")
@PreAuthorize("isAuthenticated()")
public class TrainingBundleController {

    @Autowired
    private TrainingBundleFacade service;

    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping
    @ResponseBody
    public Page<TrainingBundleResource> findAll(Pageable pageable) {
        return service.findAll(pageable).map(TrainingBundleResource::new);
    }

    @GetMapping(path = "/{id}")
    public ResponseEntity<TrainingBundleResource> findById(@PathVariable Long id) {
        ATrainingBundle bundle = service.findById(id);
        return ResponseEntity.ok(new TrainingBundleAssembler().toModel(bundle));
    }

    @DeleteMapping(path = "/{id}")
    public ResponseEntity<TrainingBundleResource> delete(@PathVariable Long id) {
        ATrainingBundle bundle = service.deleteById(id);
        return ResponseEntity.ok(new TrainingBundleAssembler().toModel(bundle));
    }

    @GetMapping("/search")
    @ResponseBody
    public Page<TrainingBundleResource> search(@RequestParam(required = false) Long specId,
                                               @RequestParam(required = false) Boolean expired,
                                               @RequestParam(required = false) @DateTimeFormat(pattern="dd-MM-yyyy",
                                                iso = DateTimeFormat.ISO.DATE_TIME) Date date,
                                               Pageable pageable) {
        Page<ATrainingBundle> bundles;

         bundles = service.search(specId, expired, date, pageable);

         return bundles.map(TrainingBundleResource::new);
    }

    //TODO add activate method

    @PatchMapping(path = "/{id}")
    public ResponseEntity<TrainingBundleResource> patch(@PathVariable Long id,
                                                        HttpServletRequest request) throws IOException {
        ATrainingBundle bundle = service.findById(id);
        bundle = objectMapper.readerForUpdating(bundle).readValue(request.getReader());
        if (bundle.isExpired()) {
            bundle.completeBundle();
        }
        bundle = service.save(bundle);
        return ResponseEntity.ok(new TrainingBundleAssembler().toModel(bundle));
    }
}
