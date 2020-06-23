package it.gym.model;

import com.fasterxml.jackson.annotation.JsonTypeName;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Generated;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import java.util.Date;

@Entity
@DiscriminatorValue(value="B")
@JsonTypeName("B")
@Data
@EqualsAndHashCode(callSuper = true)
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

    @Override
    public Date getEndDate(ATrainingBundle bundle) {
        return new Date();
    }

    @Override
    public Double getPercentageStatus(ATrainingBundle trainingBundle) {
        int size = (trainingBundle.getSessions() == null) ? 0 : trainingBundle.getSessions().size();
        return 1. * size / this.getNumber();
    }

}
