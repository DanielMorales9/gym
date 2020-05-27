package it.gym.model;

import com.fasterxml.jackson.annotation.JsonTypeName;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Generated;

import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import java.util.Date;

import static org.apache.commons.lang3.time.DateUtils.addMonths;

@Entity
@DiscriminatorValue(value="B")
@JsonTypeName("B")
@Data
@EqualsAndHashCode
@Generated
public class BundlePurchaseOption extends APurchaseOption {

    @Override
    public String getType() {
        return "B";
    }

    @Override
    public Double getPrice(ATrainingBundle bundle) {
        return this.getPrice();
    }

    @Override
    public Boolean isExpired(ATrainingBundle bundle) {
        Integer size = (bundle.getSessions() == null) ? 0 : bundle.getSessions().size();
        return size.equals(this.getNumber());
    }

}
