package it.gym.repository;

import it.gym.model.ATrainingSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "sessions", path = "/sessions")
public interface TrainingSessionRepository extends JpaRepository<ATrainingSession, Long> {
}
