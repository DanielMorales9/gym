package it.gym.hateoas;

import it.gym.model.AUser;
import it.gym.repository.UserRepository;
import org.springframework.hateoas.Resources;
import org.springframework.hateoas.mvc.ResourceAssemblerSupport;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;

public class AUserAssembler extends ResourceAssemblerSupport<AUser, AUserResource> {

    public AUserAssembler(){
        super(AUser.class, AUserResource.class);
    }

    @Override
    public AUserResource toResource(AUser user) {
        AUserResource resource = new AUserResource(user);
        resource.add(linkTo(UserRepository.class).slash("users")
                .slash(user.getId()).withSelfRel());
        return resource;
    }
}
