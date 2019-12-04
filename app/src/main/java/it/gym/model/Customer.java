package it.gym.model;

import com.fasterxml.jackson.annotation.JsonProperty;
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

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(name="current_users_bundles",
            joinColumns = @JoinColumn(name="user_id", referencedColumnName="user_id"),
            inverseJoinColumns=@JoinColumn(name="bundle_id", referencedColumnName="bundle_id"))
    @JsonProperty(value = "currentTrainingBundles")
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private List<ATrainingBundle> currentTrainingBundles;


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

    public List<ATrainingBundle> getCurrentTrainingBundles() {
        return currentTrainingBundles;
    }

    public void setCurrentTrainingBundles(List<ATrainingBundle> currentTrainingBundles) {
        this.currentTrainingBundles = currentTrainingBundles;
    }

    public boolean addToCurrentTrainingBundles(List<ATrainingBundle> bundles) {
        if (this.currentTrainingBundles == null) {
            this.currentTrainingBundles = new ArrayList<>();
        }
        return this.currentTrainingBundles.addAll(bundles);
    }

    public boolean deleteBundle(ATrainingBundle bundle) {
        return this.currentTrainingBundles.remove(bundle);
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
}
