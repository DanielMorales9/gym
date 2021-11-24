package it.gym.hateoas;

import com.fasterxml.jackson.annotation.JsonProperty;
import it.gym.model.ATrainingSession;
import it.gym.model.Reservation;
import org.springframework.hateoas.RepresentationModel;

class InnerReservationResource
    extends RepresentationModel<InnerReservationResource> {

  private final Long id;
  private final Boolean confirmed;
  private final UserResource user;
  private final ATrainingSession session;

  public InnerReservationResource(Reservation res) {
    id = res.getId();
    confirmed = res.getConfirmed();
    user = new UserResource(res.getUser());
    session = res.getSession();
  }

  @JsonProperty("id")
  public Long getResId() {
    return id;
  }

  public Boolean getConfirmed() {
    return confirmed;
  }

  public UserResource getUser() {
    return user;
  }

  public ATrainingSession getSession() {
    return session;
  }
}
