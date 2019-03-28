package it.gym.model;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import org.springframework.data.rest.core.annotation.RestResource;

import javax.persistence.*;


@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.PROPERTY,
        property = "type",
        visible = true)
@JsonSubTypes({
        @JsonSubTypes.Type(value = PersonalTrainingBundleSpecification.class, name="P")
})
@Entity
@RestResource(path="bundleSpecs")
@Table(name="bundle_specs")
@Inheritance(strategy=InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name="bundle_spec_type", discriminatorType=DiscriminatorType.STRING, length=1)
public abstract class ATrainingBundleSpecification {
    @Id
    @SequenceGenerator(name = "bundle_specs_spec_id_seq",
            sequenceName = "bundle_specs_spec_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "bundle_specs_spec_id_seq")
    @Column(name="bundle_spec_id")
    private Long id;

    @Column(name = "name", nullable = false)
    protected String name;

    @Column(name = "description", nullable = false)
    protected String description;

    @Column(name = "price", nullable = false)
    protected Double price;

    @Column(name = "is_disabled", nullable = false)
    private Boolean isDisabled;

    public abstract String getType();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public abstract ATrainingBundle createTrainingBundle();

    public Boolean getDisabled() {
        return isDisabled;
    }

    public void setDisabled(Boolean disabled) {
        isDisabled = disabled;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "Nome: " +
                this.name +
                ", Descrizione: " +
                this.description;
    }

    @Override
    public boolean equals(Object o) {
        ATrainingBundleSpecification u = (ATrainingBundleSpecification) o;
        return u.getId().equals(this.getId());
    }
}
