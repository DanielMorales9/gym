package it.gym.mappers;

import it.gym.model.ATrainingBundleSpecification;
import it.gym.pojo.TrainingBundleSpecificationDTO;
import org.springframework.stereotype.Component;

@Component
public class TrainingBundleSpecificationMapper {

  public TrainingBundleSpecificationDTO toDTO(
      ATrainingBundleSpecification specs) {
    return new TrainingBundleSpecificationDTO(
        specs.getId(),
        specs.getName(),
        specs.getDescription(),
        specs.getCreatedAt(),
        specs.getDisabled(),
        specs.getType(),
        specs.getNumDeletions(),
        specs.getUnlimitedDeletions(),
        specs.getMaxCustomers(),
        specs.getOptions());
  }
}
