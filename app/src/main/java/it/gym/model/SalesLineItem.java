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

    @OneToOne(cascade = CascadeType.ALL)
    private ATrainingBundle trainingBundle;

    @ManyToOne
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

    void setBundleSpecification(ATrainingBundleSpecification bundleSpecification) {
        this.bundleSpecification = bundleSpecification;
    }

    ATrainingBundle getTrainingBundle() {
        return trainingBundle;
    }

    void setTrainingBundle(ATrainingBundle trainingBundle) {
        this.trainingBundle = trainingBundle;
    }

    Double getSubTotal() {
        return this.bundleSpecification.getPrice();
    }
}
