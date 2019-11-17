package it.gym.hateoas;

import it.gym.model.Trainer;
import org.springframework.hateoas.Resources;

public class TrainerResource extends ResourceModel<Trainer> {

    private Resources<RoleResource> role;

    TrainerResource(Trainer model) {
        super(model);
    }

    public Resources<RoleResource> getRole() {
        return role;
    }

    public void setRole(Resources<RoleResource> role) {
        this.role = role;
    }
}
