package it.gym.model;

import com.fasterxml.jackson.annotation.JsonTypeName;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Generated;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import java.util.Date;

@Entity
@DiscriminatorValue(value="A")
@JsonTypeName("A")
@Data
@EqualsAndHashCode(callSuper = true)
@Generated
public class BundleActiveState extends ABundleState {

    public BundleActiveState() {}
    public BundleActiveState(ATrainingBundle trainingBundle) { super(trainingBundle); }

    @Override
    public String getType() {
        return "A";
    }


    @Override
    public void onInit() {
        super.onInit();
        this.trainingBundle.setStartTime(this.getDate());
        this.trainingBundle.setEndTime(this.trainingBundle.getEndDate());

    }

    @Override
    public void onActivate() {
        onInit();
    }

    @Override
    public void onComplete() {
        this.trainingBundle.changeState(new BundleCompleteState(trainingBundle)).onInit();
    }

}
