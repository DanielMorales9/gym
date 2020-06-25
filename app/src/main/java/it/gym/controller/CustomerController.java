package it.gym.controller;

import it.gym.model.ATrainingBundle;
import it.gym.service.CustomerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

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
        Stream<ATrainingBundle> bundles = service.findById(id).getTrainingBundles()
                .stream().filter(a -> !a.isExpired());

        if (specId != null) {
            bundles = bundles.filter(b -> b.getBundleSpec().getId().equals(specId));
        }
        return bundles.collect(Collectors.toList());
    }

}
