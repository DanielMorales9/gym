package it.gym.service;

import it.gym.exception.NotFoundException;
import it.gym.model.Workout;
import it.gym.repository.WorkoutRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class WorkoutService implements ICrudService<Workout, Long> {

    @Autowired
    private WorkoutRepository repo;

    @Override
    @CachePut(value = "workouts-single", key = "#result.id", condition="#result != null")
    public Workout findById(Long var1) {
        return repo.findById(var1).orElseThrow(() -> new NotFoundException("Workout", var1));
    }

    @Caching (
            put = {
                    @CachePut(value = "workouts-single", key = "#result.id", condition="#result != null"),
            },
            evict = {
                    @CacheEvict(value = "workouts-all", allEntries = true),
                    @CacheEvict(value = "workouts-search", allEntries = true)
            }
    )
    @Override
    public Workout save(Workout var1) {
        return repo.save(var1);
    }

    @Caching(
            evict = {
                    @CacheEvict(value = "workouts-single", key = "#var1.id"),
                    @CacheEvict(value = "workouts-all", allEntries = true),
                    @CacheEvict(value = "workouts-search", allEntries = true)
            }
    )
    @Override
    public void delete(Workout var1) {
        repo.delete(var1);
    }

    @Override
    public List<Workout> findAll() {
        return repo.findAll();
    }

    @Cacheable(value = "workouts-all")
    public Page<Workout> findAll(Pageable pageable) {
        return repo.findAll(pageable);
    }

    public Page<Workout> search(String name, String tag, Boolean isTemplate, Pageable pageable) {
        Page<Workout> page;

        // all query params
        if (tag != null && name != null) {
            page = filterAndPageWorkoutsByQueryParams(name, tag, isTemplate, pageable);
        }

        // name or template
        if (name != null && isTemplate != null) {
            page = this.searchByNameAndTemplate(name, isTemplate, pageable);
        }
        if (name != null) {
            page = this.searchByName(name, pageable);
        }

        // tag or template
        if (tag != null && isTemplate != null) {
            page = this.filterByNameAndTemplate(tag, isTemplate, pageable);
        }
        if (tag != null) {
            page = this.filterByName(tag, pageable);
        }

        // only template or all
        if (isTemplate != null) {
            page = this.findByIsTemplate(isTemplate, pageable);
        }
        else {
            page = this.findAll(pageable);
        }

        return initAssociation(page);

    }

    private Page<Workout> filterAndPageWorkoutsByQueryParams(String name, String filter, Boolean isTemplate, Pageable pageable) {
        List<Workout> workouts = findAll()
                .stream()
                .filter(workout -> (isTemplate == null) || workout.isTemplate() == isTemplate)
                .filter(workout -> workout.getName().contains(name))
                .filter(workout ->
                        (workout.getTag1() != null && workout.getTag1().equals(filter)) ||
                                (workout.getTag2() != null && workout.getTag2().equals(filter)) ||
                                (workout.getTag3() != null && workout.getTag3().equals(filter)))
                .collect(Collectors.toList());
        return new PageImpl<>(workouts, pageable, workouts.size());
    }

    private Page<Workout> initAssociation(Page<Workout> page) {
        return page.map(Workout::eager);
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
