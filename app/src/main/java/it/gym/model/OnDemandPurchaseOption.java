package it.gym.model;

import com.fasterxml.jackson.annotation.JsonTypeName;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Generated;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import java.util.Date;

import static org.apache.commons.lang3.time.DateUtils.addMonths;

@Entity
@DiscriminatorValue(value="D")
@JsonTypeName("D")
@Data
@EqualsAndHashCode(callSuper = true)
@Generated
public class OnDemandPurchaseOption extends APurchaseOption {

    @Override
    public String getType() {
        return "D";
    }

    @Override
    public Double getPrice(ATrainingBundle bundle) {
        int size = bundle.getSessions()!= null ? bundle.getSessions().size(): 0;
        return this.getPrice() * size;
    }

    @Override
    public Boolean isExpired(ATrainingBundle bundle) {
        if (bundle.getEndTime() != null) {
            return new Date().after(bundle.getEndTime());
        }
        else {
            return false;
        }
    }

    @Override
    public Date getEndDate(ATrainingBundle bundle) {
        return addMonths(bundle.getStartTime(), this.getNumber());
    }

    @Override
    public Double getPercentageStatus(ATrainingBundle trainingBundle) {
        long startTime = trainingBundle.getStartTime().getTime();
        long endTime = getEndDate(trainingBundle).getTime();
        long date = new Date().getTime();
        return (1.0 * (date - startTime)) / (endTime - startTime);
    }

}
