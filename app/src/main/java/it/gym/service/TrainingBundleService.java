package it.gym.service;

import it.gym.exception.NotFoundException;
import it.gym.model.ATrainingBundle;
import it.gym.repository.TrainingBundleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrainingBundleService implements ICrudService<ATrainingBundle, Long> {

    private final TrainingBundleRepository bundle;

    @Autowired
    public TrainingBundleService(TrainingBundleRepository bundle) {
        this.bundle = bundle;
    }

    @Override
    public ATrainingBundle save(ATrainingBundle var1) {
        return this.bundle.save(var1);
    }

    @Override
    public ATrainingBundle findById(Long var1) {
        return this.bundle.findById(var1)
                .orElseThrow(() -> new NotFoundException("TrainingBundle", var1));
    }

    @Override
    public void delete(ATrainingBundle var1) {
        this.bundle.delete(var1);
    }

    @Override
    public List<ATrainingBundle> findAll() {
        return this.bundle.findAll();
    }

}
