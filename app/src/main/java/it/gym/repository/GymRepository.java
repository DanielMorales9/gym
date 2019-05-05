package it.gym.repository;

import it.gym.model.Admin;
import it.gym.model.Gym;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;

@RepositoryRestResource(path="/gyms")
public interface GymRepository extends JpaRepository<Gym, Long> {

}
