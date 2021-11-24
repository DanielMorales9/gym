package it.gym.hateoas;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonUnwrapped;
import it.gym.model.ATrainingBundleSpecification;
import it.gym.model.ATrainingSession;
import it.gym.model.Workout;
import org.springframework.hateoas.RepresentationModel;

import java.util.Date;
import java.util.List;

public class TrainingSessionResource
    extends RepresentationModel<TrainingSessionResource> {

  private final Long id;
  private final boolean isCompleted;
  private final Date startTime;
  private final Date endTime;
  private final List<Workout> workouts;
  private final String type;
  private final boolean isDeletable;
  private final InnerTrainingBundleResource bundle;

  public TrainingSessionResource(ATrainingSession sessions) {
    id = sessions.getId();
    isCompleted = sessions.getCompleted();
    isDeletable = sessions.isDeletable();
    startTime = sessions.getStartTime();
    endTime = sessions.getEndTime();
    workouts = sessions.getWorkouts();
    type = sessions.getType();
    bundle = new InnerTrainingBundleResource(sessions.getTrainingBundle());
  }

  @JsonProperty("id")
  public Long getSessionId() {
    return id;
  }

  public boolean isCompleted() {
    return isCompleted;
  }

  public Date getStartTime() {
    return startTime;
  }

  public Date getEndTime() {
    return endTime;
  }

  public List<Workout> getWorkouts() {
    return workouts;
  }

  public String getType() {
    return type;
  }

  public InnerTrainingBundleResource getBundle() {
    return bundle;
  }

  public boolean isDeletable() {
    return isDeletable;
  }
}
