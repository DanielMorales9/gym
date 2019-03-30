package it.gym.hateoas;

import it.gym.model.AUser;
import org.springframework.hateoas.Resources;

public class AUserResource extends ResourceModel<AUser> {

    private Resources<RoleResource> roles;

    AUserResource(AUser model) {
        super(model);
    }

    public Resources<RoleResource> getRoles() {
        return roles;
    }

    public void setRoles(Resources<RoleResource> roles) {
        this.roles = roles;
    }
}
