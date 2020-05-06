package it.gym.facade;

import com.fasterxml.jackson.databind.ObjectMapper;
import it.gym.exception.BadRequestException;
import it.gym.model.ATrainingSession;
import it.gym.model.PersonalTrainingEvent;
import it.gym.model.Workout;
import it.gym.service.EventService;
import it.gym.service.TrainingSessionService;
import it.gym.service.WorkoutService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.transaction.Transactional;
import java.io.IOException;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Component
@Transactional
public class WorkoutFacade {

    private static final Logger logger = LoggerFactory.getLogger(WorkoutFacade.class);

    @Autowired
    private WorkoutService service;

    @Autowired
    private EventService eventService;

    @Autowired
    @Qualifier("trainingSessionService")
    private TrainingSessionService sessionService;

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
        if (name != null) {
            logger.info(name);
        }
        if (tag != null) {
            logger.info(tag);
        }
        if (isTemplate != null) {
            logger.info(isTemplate.toString());
        }

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
                        (workout.getTag1() != null && workout.getTag1().equals(filter)) ||
                                (workout.getTag2() != null && workout.getTag2().equals(filter)) ||
                                (workout.getTag3() != null && workout.getTag3().equals(filter)))
                .collect(Collectors.toList());
        return new PageImpl<>(workouts, pageable, workouts.size());
    }

    public List<String> getTags() {
        return this.findAll().stream()
                .map(workout -> Arrays.asList(workout.getTag1(), workout.getTag2(), workout.getTag3()))
                .flatMap(Collection::stream)
                .filter(Objects::nonNull)
                .distinct()
                .collect(Collectors.toList());
    }

    public void assign(Long id, Long eventId) {
        Workout w = this.findById(id);
        if (!w.isTemplate()) {
            throw new BadRequestException(String.format("Workout %s non può essere assegnato", w.getName()));
        }

        PersonalTrainingEvent evt = (PersonalTrainingEvent) eventService.findById(eventId);
        evt.assignWorkout(w);
        ATrainingSession session = evt.getSession();
        sessionService.save(session);
    }
}
