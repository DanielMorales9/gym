package it.gym.repository;

import it.gym.model.ATrainingSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrainingSessionRepository extends JpaRepository<ATrainingSession, Long> {
}
