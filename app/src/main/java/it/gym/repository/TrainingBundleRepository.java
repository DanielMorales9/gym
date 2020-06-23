package it.gym.repository;

import it.gym.model.ATrainingBundle;
import it.gym.model.ATrainingBundleSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface TrainingBundleRepository extends JpaRepository<ATrainingBundle, Long> {

    List<ATrainingBundle> findATrainingBundleByBundleSpec(ATrainingBundleSpecification spec);
    Page<ATrainingBundle> findATrainingBundleByBundleSpec_Id(Long id, Pageable pageable);
    Page<ATrainingBundle> findBundlesByExpiredAtGreaterThan(Date time, Pageable pageable);
    Page<ATrainingBundle> findBundlesByCreatedAtGreaterThan(Date time, Pageable pageable);
    Page<ATrainingBundle> findBundlesByExpiredAtNotNull(Pageable pageable);
    Page<ATrainingBundle> findBundlesByExpiredAtNull(Pageable pageable);
    List<ATrainingBundle> findBundlesByExpiredAtNull();
}
