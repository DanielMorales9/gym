package it.gym.repository;

import it.gym.model.ATrainingBundle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrainingBundleRepository extends JpaRepository<ATrainingBundle, Long> {
}
