package it.gym.hateoas;

import it.gym.model.TimeOff;
import org.springframework.hateoas.mvc.ResourceAssemblerSupport;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;

public class TimeOffAssembler extends ResourceAssemblerSupport<TimeOff, TimeOffResource> {
    public TimeOffAssembler() {
        super(TimeOff.class, TimeOffResource.class);
    }

    @Override
    public TimeOffResource toResource(TimeOff timeOff) {
        TimeOffResource res =  new TimeOffResource(timeOff);
        res.add(linkTo(TimeOff.class).slash("timeOff")
                .slash(timeOff.getId()).withSelfRel());
        res.setUser(timeOff.getUser());
        return res;
    }
}
