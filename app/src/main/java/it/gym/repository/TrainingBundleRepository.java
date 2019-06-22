package it.gym.repository;

import it.gym.model.ATrainingBundle;
import it.gym.model.ATrainingBundleSpecification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrainingBundleRepository extends JpaRepository<ATrainingBundle, Long> {

    List<ATrainingBundle> findATrainingBundleByBundleSpec(ATrainingBundleSpecification spec);
}
