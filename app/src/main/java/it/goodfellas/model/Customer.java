package it.goodfellas.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import it.goodfellas.utility.Constants;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Entity
@DiscriminatorValue(value="C")
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

    boolean addToCurrentTrainingBundles(List<ATrainingBundle> bundles) {
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
                new Role((long) 3, "CUSTOMER"));
    }

}
