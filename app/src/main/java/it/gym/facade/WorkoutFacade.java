package it.gym.facade;

import com.fasterxml.jackson.databind.ObjectMapper;
import it.gym.model.Workout;
import it.gym.service.WorkoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.transaction.Transactional;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Component
@Transactional
public class WorkoutFacade {

    @Autowired
    private WorkoutService service;
    @Autowired
    private ObjectMapper objectMapper;

    public Workout findById(Long var1) {
        return service.findById(var1);
    }

    public Workout save(Workout w) {
        return service.save(w);
    }

    public List<Workout> findAll() {
        return service.findAll();
    }

    public void deleteById(Long id) {
        Workout w = service.findById(id);
        service.delete(w);
    }

    public Page<Workout> findAll(Pageable pageable) {
        return service.findAll(pageable);
    }

    public Workout patch(Long id, HttpServletRequest request) throws IOException {
        Workout w = service.findById(id);
        w = objectMapper.readerForUpdating(w).readValue(request.getReader());
        return service.save(w);
    }

    public Page<Workout> search(String name, String tag, Boolean isTemplate, Pageable pageable) {
        // all query params
        if (tag != null && name != null) {
            return filterAndPageWorkoutsByQueryParams(name, tag, isTemplate, pageable);
        }

        // name or template
        if (name != null && isTemplate != null) {
            return service.searchByNameAndTemplate(name, isTemplate, pageable);
        }
        if (name != null) {
            return service.searchByName(name, pageable);
        }

        // tag or template
        if (tag != null && isTemplate != null) {
            return service.filterByNameAndTemplate(tag, isTemplate, pageable);
        }
        if (tag != null) {
            return service.filterByName(tag, pageable);
        }

        // only template or all
        if (isTemplate != null) {
            return service.findByIsTemplate(isTemplate, pageable);
        }
        else {
            return service.findAll(pageable);
        }

    }

    private Page<Workout> filterAndPageWorkoutsByQueryParams(String name, String filter, Boolean isTemplate, Pageable pageable) {
        List<Workout> workouts = service.findAll()
                .stream()
                .filter(workout -> (isTemplate == null) || workout.isTemplate() == isTemplate)
                .filter(workout -> workout.getName().contains(name))
                .filter(workout ->
                                    workout.getTag1().equals(filter) ||
                                    workout.getTag2().equals(filter) ||
                                    workout.getTag3().equals(filter))
                .collect(Collectors.toList());
        return new PageImpl<>(workouts, pageable, workouts.size());
    }
}
