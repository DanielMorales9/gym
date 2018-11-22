package it.goodfellas.controller;

import it.goodfellas.model.ATrainingBundleSpecification;
import it.goodfellas.repository.TrainingBundleSpecificationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@RepositoryRestController
public class TrainingBundleSpecificationController {
    private final static Logger logger = LoggerFactory.getLogger(TrainingBundleSpecificationController.class);

    private final TrainingBundleSpecificationRepository repository;

    @Autowired
    public TrainingBundleSpecificationController(TrainingBundleSpecificationRepository repository) {
        this.repository = repository;
    }


    @GetMapping(path = "/bundleSpecs/search")
    @ResponseBody
    Page<ATrainingBundleSpecification> search(@RequestParam String query, Pageable pageable) {
        logger.info("Query: " + query);
        return repository.findByNameContains(query, pageable);
    }

    @GetMapping(path = "/bundleSpecs/searchNotDisabled")
    @ResponseBody
    Page<ATrainingBundleSpecification> searchNotDisabled(@RequestParam String query, Pageable pageable) {
        logger.info("Query: " + query);
        return repository.findByNameContainsAndIsDisabled(query, false, pageable);
    }

    @GetMapping(path = "/bundleSpecs/getNotDisabled")
    @ResponseBody
    Page<ATrainingBundleSpecification> getNotDisabled(Pageable pageable) {
        return repository.findByIsDisabled(false, pageable);
    }
}
