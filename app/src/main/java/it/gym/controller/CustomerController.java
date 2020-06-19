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
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/customers")
public class CustomerController {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    private CustomerService service;

    @GetMapping(path = "/bundles")
    @ResponseBody
    public Page<ATrainingBundle> findBundles(@RequestParam Long id,
                                             @RequestParam(required = false) Boolean expired,
                                             @RequestParam(required = false) String name,
                                             @RequestParam(required = false)
                                             @DateTimeFormat(pattern = "dd-MM-yyyy",
                                                     iso = DateTimeFormat.ISO.DATE_TIME) Date date,
                                             Pageable pageable) {
        return service.findBundles(id, expired, name, date, pageable);
    }

    @GetMapping(path = "/{id}/currentTrainingBundles")
    @ResponseBody
    public List<ATrainingBundle> findBundles(@PathVariable Long id,
                                             @RequestParam(required = false) Long specId) {
        List<ATrainingBundle> bundles = service.findById(id).getCurrentTrainingBundles();
        if (specId != null) {
            bundles = bundles
                .stream()
                .filter(b -> b.getBundleSpec().getId().equals(specId))
                .collect(Collectors.toList());
        }
        return bundles;
    }

}
