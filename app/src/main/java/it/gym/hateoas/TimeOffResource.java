package it.gym.hateoas;

import it.gym.model.AUser;
import it.gym.model.TimeOff;

public class TimeOffResource extends ResourceModel<TimeOff>  {

    private AUser user;

    TimeOffResource(TimeOff model) {
        super(model);
    }

    public AUser getUser() {
        return user;
    }

    public void setUser(AUser user) {
        this.user = user;
    }
}
