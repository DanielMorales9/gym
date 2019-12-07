package it.gym.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Generated;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Table(name = "sales")
@Data
@EqualsAndHashCode
@Generated //exclude coverage analysis on generated methods
public class Sale {

    @Id
    @SequenceGenerator(name = "sales_sale_id_seq",
            sequenceName = "sales_sale_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sales_sale_id_seq")
    @Column(name="sale_id")
    private Long id;

    @Column(name = "createdat", nullable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "payed_date")
    private Date payedDate;

    @Column(name = "total_price")
    private Double totalPrice;

    @Column(name = "amount_payed")
    private Double amountPayed;

    @Column(name = "is_payed")
    private boolean isPayed;
    @Column(name = "is_completed")
    private boolean isCompleted;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "sale_id")
    private List<SalesLineItem> salesLineItems;

    @ManyToOne
    @JoinColumn(name = "customer_user_id")
    private Customer customer;

    public Sale() {
        salesLineItems = new ArrayList<>();
    }

    public List<SalesLineItem> getSalesLineItems() {
        return salesLineItems;
    }

    public void setSalesLineItems(List<SalesLineItem> salesLineItems) {
        this.salesLineItems = salesLineItems;
    }

    public boolean isPayed() {
        return isPayed;
    }

    public void setPayed(boolean payed) {
        isPayed = payed;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public Date getPayedDate() {
        return payedDate;
    }

    public void setPayedDate(Date payedDate) {
        this.payedDate = payedDate;
    }

    public boolean isCompleted() {
        return isCompleted;
    }

    public void setCompleted(boolean completed) {
        isCompleted = completed;
    }

    public Double getAmountPayed() {
        return amountPayed;
    }

    public void setAmountPayed(Double amountPayed) {
        this.amountPayed = amountPayed;
    }


    public Double getTotalPrice() {
        this.totalPrice = salesLineItems.stream().map(SalesLineItem::getSubTotal).reduce(Double::sum).orElse(0.);
        return this.totalPrice;
    }

    public SalesLineItem addSalesLineItem(ATrainingBundle bundle) {
        if (this.salesLineItems == null) {
            this.salesLineItems = new ArrayList<>();
        }
        SalesLineItem line = new SalesLineItem();
        line.setBundleSpecification(bundle.getBundleSpec());
        line.setTrainingBundle(bundle);
        this.salesLineItems.add(line);
        return line;
    }

    public boolean deleteSalesLineItem(SalesLineItem salesLineItem) {
        return this.salesLineItems.remove(salesLineItem);
    }

    public boolean confirmSale() {
        if (this.salesLineItems == null)
            return false;
        if (this.salesLineItems.size() == 0)
            return false;
        this.isCompleted = true;
        this.getTotalPrice();
        return true;
    }

    public boolean isDeletable() {
        if (this.salesLineItems == null) {
            return true;
        }
        //if it has not been paid and has not been used
        return this.salesLineItems.stream()
                .map(SalesLineItem::getTrainingBundle)
                .filter(ATrainingBundle::isNotGroup)
                .map(ATrainingBundle::isDeletable)
                .reduce(Boolean::logicalAnd).orElse(true);
    }

    public boolean addBundlesToCustomersCurrentBundles() {
        return this.customer.addToCurrentTrainingBundles(
                this.salesLineItems.stream()
                        .map(SalesLineItem::getTrainingBundle)
                        .collect(Collectors.toList()));
    }

    public boolean removeBundlesFromCustomersCurrentBundles() {
        List<ATrainingBundle> trainingBundles = this.getSalesLineItems()
                .stream()
                .map(SalesLineItem::getTrainingBundle)
                .collect(Collectors.toList());
        if (trainingBundles.isEmpty() || this.getCustomer().getCurrentTrainingBundles().isEmpty())
            return true;
        return this.getCustomer().getCurrentTrainingBundles().removeAll(trainingBundles);
    }

    @PrePersist
    protected void prePersist() {
        this.createdAt = new Date();
    }
}
