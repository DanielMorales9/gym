package it.gym.hateoas;

import it.gym.model.AEvent;
import it.gym.model.AUser;
import it.gym.model.TimeOff;

public class EventResource extends ResourceModel<AEvent>  {

    EventResource(AEvent model) {
        super(model);
    }

}
