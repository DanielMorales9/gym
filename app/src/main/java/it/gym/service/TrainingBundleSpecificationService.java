package it.gym.service;

import it.gym.exception.NotFoundException;
import it.gym.model.ATrainingBundleSpecification;
import it.gym.repository.TrainingBundleSpecificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class TrainingBundleSpecificationService implements ICrudService<ATrainingBundleSpecification, Long> {

    @Autowired
    private TrainingBundleSpecificationRepository repository;

    public ATrainingBundleSpecification save(ATrainingBundleSpecification var1) {
        return this.repository.save(var1);
    }

    public ATrainingBundleSpecification createBundle(ATrainingBundleSpecification var1) {
        return this.repository.save(var1);
    }

    public ATrainingBundleSpecification findById(Long var1) {
        return this.repository.findById(var1)
                .orElseThrow(() -> new NotFoundException("Pacchetto", var1));
    }

    public void delete(ATrainingBundleSpecification var1) {
        this.repository.delete(var1);
    }

    public List<ATrainingBundleSpecification> findAll() {
        return this.repository.findAll();
    }

    public Page<ATrainingBundleSpecification> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public Page<ATrainingBundleSpecification> findByNameContains(String query, Pageable pageable) {
        return repository.findByNameContains(query, pageable);
    }

    public Page<ATrainingBundleSpecification> findByNameContainsAndIsDisabled(String query, boolean disabled, Pageable pageable) {
        return repository.findByNameContainsAndIsDisabled(query, disabled, pageable);
    }

    public Page<ATrainingBundleSpecification> findByIsDisabled(boolean disabled, Pageable pageable) {
        return repository.findByIsDisabled(disabled, pageable);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}
