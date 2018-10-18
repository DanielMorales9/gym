package it.goodfellas.hateoas;

import it.goodfellas.model.Customer;
import org.springframework.hateoas.Resources;

public class CustomerResource extends ResourceModel<Customer> {

    private Resources<RoleResource> roles;

    public CustomerResource(Customer model) {
        super(model);
    }

    public Resources<RoleResource> getRoles() {
        return roles;
    }

    public void setRoles(Resources<RoleResource> role) {
        this.roles = role;
    }

}
