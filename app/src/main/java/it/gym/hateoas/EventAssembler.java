package it.gym.hateoas;

import it.gym.model.AEvent;
import it.gym.model.TimeOff;
import org.springframework.hateoas.mvc.ResourceAssemblerSupport;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;

public class EventAssembler extends ResourceAssemblerSupport<AEvent, EventResource> {

    public EventAssembler() {
        super(TimeOff.class, EventResource.class);
    }

    @Override
    public EventResource toResource(AEvent event) {
        EventResource res =  new EventResource(event);
        res.add(linkTo(AEvent.class).slash("events")
                .slash(event.getId()).withSelfRel());
        return res;
    }
}
