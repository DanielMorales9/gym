package it.goodfellas.model;


import javax.persistence.*;

@Entity
@Table(name = "sales_lines")
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

    Double getSubTotal() {
        return this.bundleSpecification.getPrice();
    }

    public ATrainingBundleSpecification getBundleSpecification() {
        return bundleSpecification;
    }

    private void setBundleSpecification(ATrainingBundleSpecification bundleSpecification) {
        this.bundleSpecification = bundleSpecification;
    }

    void addBundles(ATrainingBundleSpecification bundleSpec) {
        this.setBundleSpecification(bundleSpec);
        this.trainingBundle = this.bundleSpecification.createTrainingBundle();
    }

    public ATrainingBundle getTrainingBundle() {
        return trainingBundle;
    }

    public void setTrainingBundle(ATrainingBundle trainingBundle) {
        this.trainingBundle = trainingBundle;
    }

    @Override
    public String toString() {
        return this.bundleSpecification.toString();
    }

    @Override
    public boolean equals(Object o) {
        SalesLineItem u = (SalesLineItem) o;
        return u.getId().equals(this.getId());
    }
}
