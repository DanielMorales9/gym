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
@DiscriminatorValue(value = "T")
@JsonTypeName("T")
@Data
@EqualsAndHashCode(callSuper = true)
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
    if (bundle.getEndTime() != null) {
      return new Date().after(bundle.getEndTime());
    } else {
      return false;
    }
  }

  @Override
  public Date getEndDate(ATrainingBundle bundle) {
    return addMonths(bundle.getStartTime(), this.getNumber());
  }

  @Override
  public Double getPercentageStatus(ATrainingBundle trainingBundle) {
    Date startDate = trainingBundle.getStartTime();
    if (startDate == null) {
      return 0.0;
    }
    long startTime = startDate.getTime();
    long endTime = getEndDate(trainingBundle).getTime();
    long date = new Date().getTime();
    return (1.0 * (date - startTime)) / (endTime - startTime);
  }

  @Override
  public boolean equals(Object o) {
    return super.equals(o);
  }

  @Override
  public String toString() {
    return super.toString();
  }
}
