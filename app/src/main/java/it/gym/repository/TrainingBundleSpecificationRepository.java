package it.gym.repository;

import it.gym.model.ATrainingBundleSpecification;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrainingBundleSpecificationRepository
    extends JpaRepository<ATrainingBundleSpecification, Long> {

  boolean existsByName(String name);

  Page<ATrainingBundleSpecification> findByNameContains(
      String name, Pageable pageable);

  Page<ATrainingBundleSpecification> findByIsDisabled(
      Boolean isDisabled, Pageable pageable);

  Page<ATrainingBundleSpecification> findByNameAndIsDisabled(
      String name, Boolean disabled, Pageable pageable);

  List<ATrainingBundleSpecification> findByIsDisabled(Boolean disabled);
}
