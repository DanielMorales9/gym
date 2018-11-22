package it.goodfellas.hateoas;

import it.goodfellas.model.Customer;
import it.goodfellas.repository.CustomerRepository;
import it.goodfellas.utility.Constants;
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
        resource.setRoles(new Resources<>(new RoleAssembler().toResources(custom.getRoles())));
        resource.add(linkTo(CustomerRepository.class).slash(Constants.CUSTOMER_BASE_PATH)
                .slash(custom.getId()).withSelfRel());
        resource.add(linkTo(CustomerRepository.class).slash(Constants.CUSTOMER_BASE_PATH)
                .slash(custom.getId()).slash("currentTrainingBundles").withRel("currentTrainingBundles"));
        return resource;
    }
}
