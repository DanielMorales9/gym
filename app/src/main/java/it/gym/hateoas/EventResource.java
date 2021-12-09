package it.gym.hateoas;

import com.fasterxml.jackson.annotation.JsonProperty;
import it.gym.dto.SimpleUserDTO;
import it.gym.model.*;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.hateoas.RepresentationModel;

public abstract class EventResource extends RepresentationModel<EventResource> {
  private final Long id;
  private final String name;
  private final Date startTime;
  private final Date endTime;
  private final String type;

  public EventResource(AEvent event) {
    this.id = event.getId();
    this.name = event.getName();
    this.startTime = event.getStartTime();
    this.endTime = event.getEndTime();
    this.type = event.getType();
  }

  @JsonProperty("id")
  public Long getEventId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public Date getStartTime() {
    return startTime;
  }

  public Date getEndTime() {
    return endTime;
  }

  public String getType() {
    return type;
  }
}

class TrainingEventResource extends EventResource {

  private final InnerTrainingBundleSpecificationResource specification;
  private final boolean isExternal;
  private final boolean isTrainingEvent;
  private final List<InnerReservationResource> reservations;

  public TrainingEventResource(ATrainingEvent event) {
    super(event);
    this.specification =
        new InnerTrainingBundleSpecificationResource(event.getSpecification());
    this.isExternal = event.isExternal();
    this.isTrainingEvent = event.isTrainingEvent();
    reservations =
        event.getReservations().stream()
            .map(InnerReservationResource::new)
            .collect(Collectors.toList());
  }

  public InnerTrainingBundleSpecificationResource getSpecification() {
    return specification;
  }

  public boolean isExternal() {
    return isExternal;
  }

  public boolean isTrainingEvent() {
    return isTrainingEvent;
  }

  public List<InnerReservationResource> getReservations() {
    return reservations;
  }
}

class CourseTrainingEventResource extends TrainingEventResource {
  private final Integer maxCustomer;

  public CourseTrainingEventResource(CourseTrainingEvent event) {
    super(event);
    this.maxCustomer = event.getMaxCustomers();
  }

  public Integer getMaxCustomer() {
    return maxCustomer;
  }
}

class TimeOffResource extends EventResource {

  private final SimpleUserDTO user;

  public TimeOffResource(TimeOff event) {
    super(event);
    AUser user = event.getUser();
    this.user =
        new SimpleUserDTO(
            user.getId(), user.getFirstName(), user.getLastName());
  }

  public SimpleUserDTO getUser() {
    return user;
  }
}

class HolidayResource extends EventResource {

  public HolidayResource(Holiday event) {
    super(event);
  }
}
