package it.goodfellas.repository;

import it.goodfellas.model.ATrainingBundle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(path = "/bundles")
public interface TrainingBundleRepository extends JpaRepository<ATrainingBundle, Long> {
}
