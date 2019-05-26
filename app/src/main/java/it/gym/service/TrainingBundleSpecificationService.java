package it.gym.service;

import it.gym.exception.NotFoundException;
import it.gym.model.ATrainingBundleSpecification;
import it.gym.repository.TrainingBundleSpecificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class TrainingBundleSpecificationService implements ICrudService<ATrainingBundleSpecification, Long> {

    private final TrainingBundleSpecificationRepository bundleSpecification;

    @Autowired
    public TrainingBundleSpecificationService(TrainingBundleSpecificationRepository bundleSpecification) {
        this.bundleSpecification = bundleSpecification;
    }

    public ATrainingBundleSpecification save(ATrainingBundleSpecification var1) {
        return this.bundleSpecification.save(var1);
    }

    public ATrainingBundleSpecification findById(Long var1) {
        return this.bundleSpecification.findById(var1)
                .orElseThrow(() -> new NotFoundException("Pacchetto", var1));
    }

    public void delete(ATrainingBundleSpecification var1) {
        this.bundleSpecification.delete(var1);
    }

    public List<ATrainingBundleSpecification> findAll() {
        return this.bundleSpecification.findAll();
    }
}
