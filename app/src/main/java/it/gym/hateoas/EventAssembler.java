package it.gym.hateoas;

import it.gym.model.*;
import org.jetbrains.annotations.NotNull;
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
    public @NotNull EventResource toModel(AEvent event) {

        EventResource res;
        switch (event.getType()) {
            case "P": res = new TrainingEventResource((PersonalTrainingEvent) event); break;
            case "C": res = new CourseTrainingEventResource((CourseTrainingEvent) event); break;
            case "H": res = new HolidayResource((Holiday) event); break;
            case "T": res = new TimeOffResource((TimeOff) event); break;
            default:
                throw new IllegalStateException("Unexpected value: " + event.getType());
        }

        res.add(linkTo(AEvent.class).slash("events").slash(event.getId()).withSelfRel());
        return res;
    }
}
