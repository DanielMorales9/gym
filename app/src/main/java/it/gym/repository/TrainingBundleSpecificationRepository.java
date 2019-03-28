package it.gym.repository;

import it.gym.model.ATrainingBundleSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(path = "/bundleSpecs", collectionResourceRel = "bundleSpecs")
public interface TrainingBundleSpecificationRepository extends JpaRepository<ATrainingBundleSpecification, Long> {

    Page<ATrainingBundleSpecification> findByNameContains(String name, Pageable pageable);

    Page<ATrainingBundleSpecification> findByNameContainsAndIsDisabled(String name, Boolean IsDisabled, Pageable pageable);

    Page<ATrainingBundleSpecification>  findByIsDisabled(Boolean IsDisabled, Pageable pageable);
}
