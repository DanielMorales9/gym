package it.gym.model;

import com.fasterxml.jackson.annotation.JsonTypeName;
import it.gym.exception.BadRequestException;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Generated;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

@Entity
@DiscriminatorValue(value="C")
@JsonTypeName("C")
@Data
@EqualsAndHashCode(callSuper = true)
@Generated
public class BundleCompleteState extends ABundleState {

    public BundleCompleteState() {}

    public BundleCompleteState(ATrainingBundle trainingBundle) {
        super(trainingBundle);
    }


    @Override
    public String getType() {
        return "C";
    }

    @Override
    public void onInit() {
        super.onInit();
        trainingBundle.setExpiredAt(getDate());
    }

    @Override
    public void onActivate() {
        throw new BadRequestException("Impossibile attivare un pacchetto già completato");
    }

    @Override
    public void onComplete() {
        throw new BadRequestException("Il pacchetto è stato già completato");
    }
}
