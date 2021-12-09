package it.gym.service;

import it.gym.exception.NotFoundException;
import it.gym.model.AUser;
import it.gym.model.VerificationToken;
import it.gym.repository.VerificationTokenRepository;
import java.util.*;
import javax.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class VerificationTokenService
    implements ICrudService<VerificationToken, Long> {

  @Autowired private VerificationTokenRepository tokenRepository;

  @Override
  public VerificationToken save(VerificationToken var1) {
    return this.tokenRepository.save(var1);
  }

  @Override
  public VerificationToken findById(Long var1) {
    return this.tokenRepository
        .findById(var1)
        .orElseThrow(() -> new NotFoundException("Il token non esiste"));
  }

  @Override
  public void delete(VerificationToken var1) {
    this.tokenRepository.delete(var1);
  }

  @Override
  public List<VerificationToken> findAll() {
    return this.tokenRepository.findAll();
  }

  public VerificationToken findByUser(AUser user) {
    return this.tokenRepository
        .findByUser(user)
        .orElseThrow(() -> new NotFoundException("Il token non esiste"));
  }

  public VerificationToken findByToken(String token) {
    return this.tokenRepository
        .findByToken(token)
        .orElseThrow(() -> new NotFoundException("Il token non esiste"));
  }

  private Optional<VerificationToken> findOptionalByUser(AUser user) {
    return this.tokenRepository.findByUser(user);
  }

  public VerificationToken createOrChangeVerificationToken(AUser user) {
    Optional<VerificationToken> opt = this.findOptionalByUser(user);
    VerificationToken vk = opt.orElseGet(VerificationToken::new);
    String token = createRandomToken();
    vk.setToken(token);
    vk.setUser(user);
    setExpirationDate(vk);
    return this.save(vk);
  }

  public void invalidateToken(VerificationToken token) {
    token.setExpiryDate(new Date());
    tokenRepository.save(token);
  }

  private void setExpirationDate(VerificationToken vk) {
    Calendar cal = Calendar.getInstance();
    cal.setTime(new Date());
    cal.add(Calendar.MINUTE, VerificationToken.EXPIRATION);
    vk.setExpiryDate(cal.getTime());
  }

  private String createRandomToken() {
    return UUID.randomUUID().toString();
  }

  public boolean existsByUser(AUser user) {
    return this.tokenRepository.findByUser(user).isPresent();
  }
}
