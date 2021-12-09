package it.gym.service;

import it.gym.exception.NotFoundException;
import it.gym.model.AUser;
import it.gym.repository.UserRepository;
import java.util.List;
import javax.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class UserService implements ICrudService<AUser, Long> {

  private static final String USER = "User";

  @Autowired private UserRepository repository;

  @Caching(
      put = {
        @CachePut(
            value = "users-single",
            key = "#result.id",
            condition = "#result != null"),
        @CachePut(
            value = "users-email",
            key = "#result.email",
            condition = "#result != null"),
      },
      evict = {
        @CacheEvict(value = "users-all", allEntries = true),
        @CacheEvict(value = "users-search", allEntries = true)
      })
  @Override
  public AUser save(AUser var1) {
    return this.repository.save(var1);
  }

  @Caching(
      put = {
        @CachePut(
            value = "users-single",
            key = "#result.id",
            condition = "#result != null"),
        @CachePut(
            value = "users-email",
            key = "#result.email",
            condition = "#result != null"),
      })
  @Override
  public AUser findById(Long var1) {
    return this.repository
        .findById(var1)
        .orElseThrow(() -> new NotFoundException(USER, var1));
  }

  @Caching(
      evict = {
        @CacheEvict(value = "users-single", key = "#var1.id"),
        @CacheEvict(value = "users-email", key = "#var1.email"),
        @CacheEvict(value = "users-all", allEntries = true),
        @CacheEvict(value = "users-search", allEntries = true)
      })
  @Override
  public void delete(AUser var1) {
    this.repository.delete(var1);
  }

  @Override
  public List<AUser> findAll() {
    return this.repository.findAll();
  }

  @Caching(
      put = {
        @CachePut(
            value = "users-single",
            key = "#result.id",
            condition = "#result != null"),
        @CachePut(
            value = "users-email",
            key = "#result.email",
            condition = "#result != null"),
      })
  public AUser findByEmail(String email) {
    return this.repository.findByEmail(email);
  }

  @Caching(
      evict = {
        @CacheEvict(value = "users-single", key = "#id"),
        @CacheEvict(value = "users-email", allEntries = true),
        @CacheEvict(value = "users-all", allEntries = true),
        @CacheEvict(value = "users-search", allEntries = true),
      })
  public void deleteById(Long id) {
    this.repository.deleteById(id);
  }

  public boolean existsByEmail(String email) {
    return this.repository.findByEmail(email) != null;
  }

  @Cacheable(value = "users-search")
  public Page<AUser> findByName(String query, Pageable pageable) {
    return repository.findByLastNameContainingOrFirstNameContaining(
        query, pageable);
  }

  @Cacheable(value = "users-all")
  public Page<AUser> findAll(Pageable pageable) {
    return repository.findAll(pageable);
  }

  public List<AUser> findUserEvent(Long eventId) {
    return repository.findUserByEventId(eventId);
  }

  public List<AUser> findAllAdmins() {
    return repository.findAllByType("A");
  }
}
