package it.goodfellas.hateoas;

import it.goodfellas.model.Trainer;
import it.goodfellas.repository.TrainerRepository;
import it.goodfellas.utility.Constants;
import org.springframework.hateoas.Resources;
import org.springframework.hateoas.mvc.ResourceAssemblerSupport;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;

public class TrainerAssembler extends ResourceAssemblerSupport<Trainer, TrainerResource> {

    private Resources<RoleResource> role;

    public TrainerAssembler(){
        super(Trainer.class, TrainerResource.class);

    }

    @Override
    public TrainerResource toResource(Trainer trainer) {
        TrainerResource resource = new TrainerResource(trainer);
        resource.setRole(new Resources<>(new RoleAssembler().toResources(trainer.getRoles())));
        resource.add(linkTo(TrainerRepository.class).slash(Constants.TRAINER_BASE_PATH)
                .slash(trainer.getId()).withSelfRel());
        return resource;
    }

    public Resources<RoleResource> getRole() {
        return role;
    }

    public void setRole(Resources<RoleResource> role) {
        this.role = role;
    }
}
