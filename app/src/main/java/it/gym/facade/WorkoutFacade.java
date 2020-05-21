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
        return this.service.search(name, tag, isTemplate, pageable);
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

    public void remove(Long id, Long eventId) {
        Workout w = this.findById(id);

        if (w.isTemplate()) {
            throw new BadRequestException(String.format("Workout %s non può essere rimosso", w.getName()));
        }

        PersonalTrainingEvent evt = (PersonalTrainingEvent) eventService.findById(eventId);
        evt.removeWorkout(w);
        ATrainingSession session = evt.getSession();
        sessionService.save(session);
        this.deleteById(id);
    }
}
