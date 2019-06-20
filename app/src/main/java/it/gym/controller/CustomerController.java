package it.gym.controller;

import it.gym.hateoas.TrainingBundleAssembler;
import it.gym.hateoas.TrainingBundleResource;
import it.gym.model.ATrainingBundle;
import it.gym.model.Customer;
import it.gym.service.CustomerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/customers")
public class CustomerController {

    private static final Logger logger = LoggerFactory.getLogger(CustomerController.class);

    @Autowired
    private CustomerService service;

    @GetMapping(path = "/search")
    @ResponseBody
    @PreAuthorize("hasAnyAuthority('ADMIN', 'TRAINER')")
    Page<Customer> searchByLastName(@RequestParam String query, Pageable pageable) {
        logger.info(String.format("Query: %s", query));
        return service.findByLastName(query, pageable);
    }

    @GetMapping(path = "/customers/{id}/currentTrainingBundles")
    @PreAuthorize("isAuthenticated()")
    ResponseEntity<List<TrainingBundleResource>> getCurrentTrainingBundles(@PathVariable Long id) {
        List<ATrainingBundle> bundles = service.findById(id).getCurrentTrainingBundles();
        return new ResponseEntity<>(new TrainingBundleAssembler().toResources(bundles), HttpStatus.OK);
    }

}