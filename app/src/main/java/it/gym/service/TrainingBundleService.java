package it.gym.service;

import it.gym.exception.NotFoundException;
import it.gym.model.ATrainingBundle;
import it.gym.model.ATrainingBundleSpecification;
import it.gym.repository.TrainingBundleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrainingBundleService implements ICrudService<ATrainingBundle, Long> {

    @Autowired
    private TrainingBundleRepository repository;

    public ATrainingBundle save(ATrainingBundle var1) {
        return this.repository.save(var1);
    }

    public ATrainingBundle findById(Long var1) {
        return this.repository.findById(var1).orElseThrow(() -> new NotFoundException("Pacchetto", var1));
    }

    public void delete(ATrainingBundle var1) {
        this.repository.delete(var1);
    }

    public List<ATrainingBundle> findAll() {
        return this.repository.findAll();
    }

    public List<ATrainingBundle> findBundlesBySpec(ATrainingBundleSpecification spec) {
        return this.repository.findATrainingBundleByBundleSpec(spec);
    }
}
