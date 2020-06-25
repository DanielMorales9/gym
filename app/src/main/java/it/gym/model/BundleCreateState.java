package it.gym.model;

import com.fasterxml.jackson.annotation.JsonTypeName;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Generated;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

@Entity
@DiscriminatorValue(value="S")
@JsonTypeName("S")
@Data
@EqualsAndHashCode(callSuper = true)
@Generated
public class BundleCreateState extends ABundleState {

     public BundleCreateState() {

     }

     public BundleCreateState(ATrainingBundle trainingBundle) {
         super(trainingBundle);
     }

    @Override
    public String getType() {
        return "S";
    }

    @Override
    public void onInit() {
        super.onInit();
        trainingBundle.setCreatedAt(getDate());
    }

    @Override
    public void onActivate() {
        trainingBundle.changeState(new BundleActiveState(trainingBundle)).onInit();
    }

    @Override
    public void onComplete() {
        trainingBundle.changeState(new BundleCompleteState(trainingBundle)).onInit();
    }


}
