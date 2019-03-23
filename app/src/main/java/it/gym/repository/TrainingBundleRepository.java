package it.gym.repository;

import it.gym.model.ATrainingBundle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(path = "/bundles")
public interface TrainingBundleRepository extends JpaRepository<ATrainingBundle, Long> {
}
