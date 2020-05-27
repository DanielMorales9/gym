package it.gym.model;

import com.fasterxml.jackson.annotation.JsonTypeName;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Generated;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;
import java.util.List;

import static org.apache.commons.lang3.time.DateUtils.addMonths;

@Entity
@DiscriminatorValue(value="T")
@JsonTypeName("T")
@Data
@EqualsAndHashCode
@Generated
public class TimePurchaseOption extends APurchaseOption {

    @Override
    public String getType() {
        return "T";
    }

    @Override
    public Double getPrice(ATrainingBundle bundle) {
        return this.getPrice();
    }

    @Override
    public Boolean isExpired(ATrainingBundle bundle) {
        return new Date().after(addMonths(bundle.getStartTime(), this.getNumber()));
    }

}
