package it.gym.hateoas;

import it.gym.model.AEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.hateoas.mvc.ResourceAssemblerSupport;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;

public class EventAssembler extends ResourceAssemblerSupport<AEvent, EventResource> {

    private static final Logger logger = LoggerFactory.getLogger(EventAssembler.class);

    public EventAssembler() {
        super(AEvent.class, EventResource.class);
    }

    @Override
    public EventResource toResource(AEvent event) {
        EventResource res =  new EventResource(event);
        res.add(linkTo(AEvent.class).slash("events").slash(event.getId()).withSelfRel());
        logger.info(event.toString());
        return res;
    }
}
