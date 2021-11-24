package it.gym.hateoas;

import it.gym.model.ATrainingSession;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;

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
