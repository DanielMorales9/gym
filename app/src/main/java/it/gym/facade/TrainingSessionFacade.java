package it.gym.facade;

import it.gym.exception.BadRequestException;
import it.gym.model.ATrainingSession;
import it.gym.model.Workout;
import it.gym.service.TrainingSessionService;
import it.gym.service.WorkoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Component;

import javax.transaction.Transactional;
import java.util.Date;

@Component
@Transactional
public class TrainingSessionFacade {

  @Autowired private WorkoutService service;

  @Autowired
  @Qualifier("trainingSessionService")
  private TrainingSessionService sessionService;

  public ATrainingSession findById(Long id) {
    return sessionService.findById(id);
  }

  public void assign(Long sessionId, Long workoutId) {
    Workout w = this.service.findById(workoutId);
    if (!w.isTemplate()) {
      throw new BadRequestException(
          String.format("Workout %s non può essere assegnato", w.getName()));
    }

    ATrainingSession session = sessionService.findById(sessionId);
    session.addWorkout(w);
    sessionService.save(session);
  }

  public void remove(Long sessionId, Long workoutId) {
    Workout w = this.service.findById(workoutId);

    if (w.isTemplate()) {
      throw new BadRequestException(
          String.format("Workout %s non può essere rimosso", w.getName()));
    }

    ATrainingSession session = sessionService.findById(sessionId);
    session.removeWorkout(w);
    sessionService.save(session);
    this.service.delete(w);
  }

  public Page<ATrainingSession> findByCustomer(
      Long customerId, Date date, Pageable pageables) {
    return sessionService.findByCustomer(customerId, date, pageables);
  }
}
