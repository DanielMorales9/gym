package it.gym.service;

import it.gym.exception.NotFoundException;
import it.gym.model.ATrainingBundle;
import it.gym.model.ATrainingSession;
import it.gym.repository.TrainingBundleRepository;
import it.gym.repository.TrainingSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrainingSessionService implements ICrudService<ATrainingSession, Long> {

    @Autowired private TrainingSessionRepository repository;

    @CachePut(value = "session-single", key="#result.id")
    public ATrainingSession save(ATrainingSession var1) {
        return this.repository.save(var1);
    }

    @CachePut(value = "session-single", key="#result.id", condition="#result != null")
    public ATrainingSession findById(Long var1) {
        return this.repository.findById(var1).orElseThrow(() -> new NotFoundException("Sessione", var1));
    }

    @CacheEvict(value = "session-single", key="#var1.id", condition="#var1 != null")
    public void delete(ATrainingSession var1) {
        this.repository.delete(var1);
    }

    public List<ATrainingSession> findAll() {
        return this.repository.findAll();
    }

    public Page<ATrainingSession> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }
}
