package it.gym.hateoas;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;

import it.gym.model.ATrainingBundle;
import it.gym.repository.TrainingBundleRepository;
import org.jetbrains.annotations.NotNull;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;

public class TrainingBundleAssembler
    extends RepresentationModelAssemblerSupport<
        ATrainingBundle, TrainingBundleResource> {

  public TrainingBundleAssembler() {
    super(ATrainingBundle.class, TrainingBundleResource.class);
  }

  @Override
  public TrainingBundleResource toModel(@NotNull ATrainingBundle bundle) {
    TrainingBundleResource resource = new TrainingBundleResource(bundle);
    resource.add(
        linkTo(TrainingBundleRepository.class)
            .slash("bundles")
            .slash(bundle.getId())
            .withSelfRel());

    return resource;
  }
}
