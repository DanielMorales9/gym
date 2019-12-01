package it.gym.hateoas;

import it.gym.model.Customer;
import it.gym.repository.CustomerRepository;
import org.springframework.hateoas.Resources;
import org.springframework.hateoas.mvc.ResourceAssemblerSupport;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;

public class CustomerAssembler extends ResourceAssemblerSupport<Customer, CustomerResource> {

    public CustomerAssembler(){
        super(Customer.class, CustomerResource.class);
    }

    @Override
    public CustomerResource toResource(Customer custom) {
        CustomerResource resource = new CustomerResource(custom);
        resource.add(linkTo(CustomerRepository.class).slash("customer")
                .slash(custom.getId()).withSelfRel());
        resource.add(linkTo(CustomerRepository.class).slash("customer")
                .slash(custom.getId()).slash("currentTrainingBundles").withRel("currentTrainingBundles"));
        return resource;
    }
}
