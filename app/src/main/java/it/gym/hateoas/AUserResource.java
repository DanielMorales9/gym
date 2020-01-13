package it.gym.hateoas;

import it.gym.model.AUser;
import org.springframework.hateoas.Resources;

public class AUserResource extends ResourceModel<AUser> {

    AUserResource(AUser model) {
        super(model);
    }

}
