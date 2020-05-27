package it.gym.hateoas;

import it.gym.model.AEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;

public class EventAssembler extends RepresentationModelAssemblerSupport<AEvent, EventResource> {

    private static final Logger logger = LoggerFactory.getLogger(EventAssembler.class);

    public EventAssembler() {
        super(AEvent.class, EventResource.class);
    }

    @Override
    public EventResource toModel(AEvent event) {
        EventResource res =  new EventResource(event);
        res.add(linkTo(AEvent.class).slash("events").slash(event.getId()).withSelfRel());
        return res;
    }
}
