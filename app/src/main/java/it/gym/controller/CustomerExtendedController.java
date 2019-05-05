package it.gym.controller;

import it.gym.model.Customer;
import it.gym.repository.CustomerRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@RepositoryRestController
@RequestMapping("/customers")
public class CustomerExtendedController {

    private final static Logger logger = LoggerFactory.getLogger(UserExtendedController.class);
    private final CustomerRepository repository;


    @Autowired
    public CustomerExtendedController(CustomerRepository repository) {
        this.repository = repository;
    }

    @GetMapping(path = "/search")
    @ResponseBody
    @PreAuthorize("hasAnyAuthority('ADMIN', 'TRAINER')")
    Page<Customer> searchByLastName(@RequestParam String query, Pageable pageable) {
        logger.info("Query: " + query);
        return repository.findByLastName(query, pageable);
    }


}
