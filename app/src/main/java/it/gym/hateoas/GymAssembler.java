package it.gym.hateoas;

import it.gym.model.Gym;
import it.gym.repository.GymRepository;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;


public class GymAssembler extends RepresentationModelAssemblerSupport<Gym, GymResource> {

    public GymAssembler(){
        super(Gym.class, GymResource.class);

    }

    @Override
    public GymResource toModel(Gym gym) {
        GymResource resource = new GymResource(gym);
        resource.add(linkTo(GymRepository.class).slash("gyms")
                .slash(gym.getId()).withSelfRel());
        return resource;
    }
}
