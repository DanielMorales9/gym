package it.gym.repository;

import it.gym.model.AUser;
import it.gym.model.VerificationToken;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VerificationTokenRepository
    extends JpaRepository<VerificationToken, Long> {

  Optional<VerificationToken> findByToken(String token);

  Optional<VerificationToken> findByUser(AUser user);
}
