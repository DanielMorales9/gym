package it.gym.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Generated;
import lombok.ToString;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Entity
@DiscriminatorValue(value="C")
@Data
@EqualsAndHashCode(callSuper = true)
@Generated //exclude coverage analysis on generated methods
public class Customer extends AUser {

    @Column(name = "height")
    private Integer height;

    @Column(name = "weight")
    private Integer weight;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "customer")
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    @JsonIgnore
    private List<ATrainingBundle> trainingBundles;

    public Integer getWeight() {
        return weight;
    }

    public void setWeight(Integer weight) {
        this.weight = weight;
    }

    public Integer getHeight() {
        return height;
    }

    public void setHeight(Integer height) {
        this.height = height;
    }

    public List<ATrainingBundle> getTrainingBundles() {
        if (trainingBundles == null)
            this.trainingBundles = new ArrayList<>();
        return trainingBundles;
    }

    public void setTrainingBundles(List<ATrainingBundle> currentTrainingBundles) {
        this.trainingBundles = currentTrainingBundles;
    }

    @Override
    public List<Role> defaultRoles() {
        return Collections.singletonList(
                new Role(3L, "CUSTOMER"));
    }

    @Override
    public String getType() {
        return "C";
    }

    @Override
    public boolean isActive() {
        if (this.trainingBundles != null)
            return !this.trainingBundles.isEmpty();
        else return false;
    }
}
