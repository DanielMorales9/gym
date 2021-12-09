package it.gym.mappers;

import it.gym.dto.TrainingBundleSpecificationDTO;
import it.gym.model.ATrainingBundleSpecification;
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
