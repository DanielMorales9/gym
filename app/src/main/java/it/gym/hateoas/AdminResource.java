package it.gym.hateoas;

import it.gym.model.Admin;
import org.springframework.hateoas.Resources;

public class AdminResource extends ResourceModel<Admin> {

    private Resources<RoleResource> role;

    public AdminResource(Admin model) {
        super(model);
    }

    public Resources<RoleResource> getRole() {
        return role;
    }

    public void setRole(Resources<RoleResource> role) {
        this.role = role;
    }
}
