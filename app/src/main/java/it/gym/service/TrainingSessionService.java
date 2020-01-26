package it.gym.service;

import it.gym.exception.NotFoundException;
import it.gym.model.ATrainingBundle;
import it.gym.model.ATrainingSession;
import it.gym.repository.TrainingBundleRepository;
import it.gym.repository.TrainingSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrainingSessionService implements ICrudService<ATrainingSession, Long> {

    @Autowired private TrainingSessionRepository repository;

    public ATrainingSession save(ATrainingSession var1) {
        return this.repository.save(var1);
    }

    public ATrainingSession findById(Long var1) {
        return this.repository.findById(var1).orElseThrow(() -> new NotFoundException("Sessione", var1));
    }

    public void delete(ATrainingSession var1) {
        this.repository.delete(var1);
    }

    public List<ATrainingSession> findAll() {
        return this.repository.findAll();
    }

    public void deleteAll(List<ATrainingSession> sessions) {
        repository.deleteAll(sessions);
    }
}
