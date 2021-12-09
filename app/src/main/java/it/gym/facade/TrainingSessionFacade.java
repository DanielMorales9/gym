package it.gym.facade;

import it.gym.exception.BadRequestException;
import it.gym.model.ATrainingSession;
import it.gym.model.Workout;
import it.gym.service.TrainingSessionService;
import it.gym.service.WorkoutService;
import java.util.Date;
import javax.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

@Component
@Transactional
public class TrainingSessionFacade {

  private final WorkoutService service;

  private final TrainingSessionService sessionService;

  public TrainingSessionFacade(
      WorkoutService service, TrainingSessionService sessionService) {
    this.service = service;
    this.sessionService = sessionService;
  }

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
