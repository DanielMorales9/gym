package it.gym.hateoas;

import it.gym.model.Customer;
import org.springframework.hateoas.Resources;

public class CustomerResource extends ResourceModel<Customer> {

    public CustomerResource(Customer model) {
        super(model);
    }
}
