package it.gym.model;


import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Generated;

import javax.persistence.*;

@Entity
@Table(name = "sales_lines")
@Data
@EqualsAndHashCode
@Generated //exclude coverage analysis on generated methods
public class SalesLineItem {
    @Id
    @SequenceGenerator(name = "sales_lines_line_id_seq",
            sequenceName = "sales_lines_line_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sales_lines_line_id_seq")
    @Column(name="line_id")
    private Long id;

    @OneToOne(cascade = {CascadeType.REFRESH, CascadeType.MERGE, CascadeType.DETACH, CascadeType.PERSIST})
    @JoinColumn(name = "training_bundle_bundle_id")
    private ATrainingBundle trainingBundle;

    @ManyToOne
    @JoinColumn(name = "bundle_specification_bundle_spec_id")
    private ATrainingBundleSpecification bundleSpecification;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ATrainingBundleSpecification getBundleSpecification() {
        return bundleSpecification;
    }

    public void setBundleSpecification(ATrainingBundleSpecification bundleSpecification) {
        this.bundleSpecification = bundleSpecification;
    }

    public ATrainingBundle getTrainingBundle() {
        return trainingBundle;
    }

    public void setTrainingBundle(ATrainingBundle trainingBundle) {
        this.trainingBundle = trainingBundle;
    }

    Double getSubTotal() {
        return this.bundleSpecification.getPrice();
    }
}
