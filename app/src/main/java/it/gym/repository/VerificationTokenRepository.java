package it.gym.repository;

import it.gym.model.AUser;
import it.gym.model.VerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported = false)
public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {

    VerificationToken findByToken(String token);
    
    VerificationToken findByUser(AUser user);
}
