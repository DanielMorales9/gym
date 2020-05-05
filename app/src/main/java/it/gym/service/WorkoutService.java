package it.gym.service;

import it.gym.exception.NotFoundException;
import it.gym.model.Workout;
import it.gym.repository.WorkoutRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
@Transactional
public class WorkoutService implements ICrudService<Workout, Long> {

    @Autowired
    private WorkoutRepository repo;

    @Override
    public Workout save(Workout var1) {
        return repo.save(var1);
    }

    @Override
    public Workout findById(Long var1) {
        return repo.findById(var1).orElseThrow(() -> new NotFoundException("Workout", var1));
    }

    @Override
    public void delete(Workout var1) {
        repo.delete(var1);
    }

    @Override
    public List<Workout> findAll() {
        return repo.findAll();
    }

    public Page<Workout> findAll(Pageable pageable) {
        return repo.findAll(pageable);
    }

    public Page<Workout> searchByNameAndTemplate(String query, Boolean isTemplate, Pageable pageable) {
        return repo.findByNameContainsAndIsTemplateIs(query, isTemplate, pageable);
    }

    public Page<Workout> filterByNameAndTemplate(String query, Boolean isTemplate, Pageable pageable) {
        return repo.findByTag1EqualsOrTag2EqualsOrTag3EqualsAndIsTemplateIs(query, query, query, isTemplate, pageable);
    }

    public Page<Workout> searchByName(String query, Pageable pageable) {
        return repo.findByNameContains(query, pageable);
    }

    public Page<Workout> filterByName(String query, Pageable pageable) {
        return repo.findByTag1EqualsOrTag2EqualsOrTag3Equals(query, query, query, pageable);
    }

    public Page<Workout> findByIsTemplate(Boolean isTemplate, Pageable pageable) {
        return repo.findByIsTemplateIs(isTemplate, pageable);
    }
}
