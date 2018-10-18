package it.goodfellas.model;

import it.goodfellas.utility.Constants;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import java.util.Collections;
import java.util.List;

@Entity
@DiscriminatorValue(value="T")
public class Trainer extends AUser {

    @Override
    public List<Long> getDefaultRoles() {
        return Collections.singletonList(Constants.ROLE_ID_TRAINER);
    }

}
