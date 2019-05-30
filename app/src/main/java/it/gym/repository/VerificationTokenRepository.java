package it.gym.repository;

import it.gym.model.AUser;
import it.gym.model.VerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.Optional;

@RepositoryRestResource(exported = false)
public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {

    Optional<VerificationToken> findByToken(String token);
    
    Optional<VerificationToken> findByUser(AUser user);
}
