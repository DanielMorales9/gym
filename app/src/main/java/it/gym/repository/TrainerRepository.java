package it.gym.repository;

import it.gym.model.Trainer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource
public interface TrainerRepository extends JpaRepository<Trainer, Long> {

    Trainer findByEmail(String email);

    @Query("select count(t.id) as numTrainer from Trainer as t")
    Long countAllTrainer();

}
