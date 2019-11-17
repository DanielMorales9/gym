package it.gym.repository;

import it.gym.model.ATrainingBundleSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrainingBundleSpecificationRepository extends JpaRepository<ATrainingBundleSpecification, Long> {

    Page<ATrainingBundleSpecification> findByNameContains(String name, Pageable pageable);

    Page<ATrainingBundleSpecification> findByNameContainsAndIsDisabled(String name, Boolean isDisabled, Pageable pageable);

    Page<ATrainingBundleSpecification> findByIsDisabled(Boolean isDisabled, Pageable pageable);
}
