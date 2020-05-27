package it.gym.hateoas;

import com.fasterxml.jackson.annotation.JsonUnwrapped;
import it.gym.model.AEvent;
import it.gym.model.AUser;
import it.gym.model.SalesLineItem;
import it.gym.model.TimeOff;
import org.springframework.hateoas.RepresentationModel;

public class EventResource extends RepresentationModel<EventResource> {

    @JsonUnwrapped
    AEvent model;

    EventResource(AEvent model) {
        this.model = model;
    }

}
