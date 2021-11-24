package it.gym.hateoas;

import it.gym.model.ATrainingBundle;
import it.gym.model.ATrainingSession;
import it.gym.repository.TrainingBundleRepository;
import it.gym.repository.TrainingSessionRepository;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;

public class TrainingSessionAssembler
    extends RepresentationModelAssemblerSupport<
        ATrainingSession, TrainingSessionResource> {

  public TrainingSessionAssembler() {
    super(ATrainingSession.class, TrainingSessionResource.class);
  }

  @Override
  public TrainingSessionResource toModel(ATrainingSession session) {
    return new TrainingSessionResource(session);
  }
}
