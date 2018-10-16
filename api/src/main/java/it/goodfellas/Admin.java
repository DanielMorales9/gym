package it.goodfellas;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import java.util.Arrays;
import java.util.List;

@Entity
@DiscriminatorValue(value="A")
public class Admin extends AUser {

    @Override
    public List<Long> getDefaultRoles() {
        return Arrays.asList(Constants.ROLES);
    }

}
