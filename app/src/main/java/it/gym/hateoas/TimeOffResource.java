package it.goodfellas.hateoas;

import it.goodfellas.model.AUser;
import it.goodfellas.model.TimeOff;

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
