package it.goodfellas.model;

import it.goodfellas.exception.InvalidSaleException;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Table(name = "sales")
public class Sale {

    @Id
    @SequenceGenerator(name = "sales_sale_id_seq",
            sequenceName = "sales_sale_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sales_sale_id_seq")
    @Column(name="sale_id")
    private Long id;


    private Double totalPrice;
    private Double amountPayed;

    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @Temporal(TemporalType.TIMESTAMP)
    private Date payedDate;

    private boolean isPayed;

    @OneToMany(cascade = CascadeType.ALL)
    private List<SalesLineItem> salesLineItems;

    @ManyToOne
    private Admin admin;

    @ManyToOne
    private Customer customer;

    private boolean isCompleted;

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

    public Double getTotalPrice() {
        this.totalPrice = salesLineItems.stream().map(SalesLineItem::getSubTotal).reduce(Double::sum).orElse(0.);
        return this.totalPrice;
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

    public void setAdmin(Admin admin) {
        this.admin = admin;
    }

    public Admin getAdmin() {
        return admin;
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

    public SalesLineItem addSalesLineItem(int quantity, ATrainingBundleSpecification bundleSpec) {
        if (this.salesLineItems == null) {
            this.salesLineItems = new ArrayList<>();
        }
        SalesLineItem line = new SalesLineItem();
        line.addBundles(bundleSpec);
        this.salesLineItems.add(line);
        return line;
    }

    public boolean deleteSalesLineItem(SalesLineItem salesLineItem) {
        return this.salesLineItems.remove(salesLineItem);
    }

    public void confirmSale() {
        if (this.salesLineItems == null)
            throw new InvalidSaleException(String.format("Impossibile confermare vendita (%d) vuota.", this.id));
        if (this.salesLineItems.size() == 0)
            throw new InvalidSaleException(String.format("Impossibile confermare vendita (%d) vuota.", this.id));
        this.isCompleted = true;
        this.getTotalPrice();
    }

    public boolean isCompleted() {
        return isCompleted;
    }

    public void setCompleted(boolean completed) {
        isCompleted = completed;
    }

    public boolean isDeletable() {
        if (this.salesLineItems == null) {
            return true;
        }
        //if it has not been paid and has not been used
        return this.getAmountPayed() == 0. && this.salesLineItems.stream()
                .map(SalesLineItem::getTrainingBundle)
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

    @Override
    public String toString() {
        StringBuilder build = new StringBuilder();
        build.append(customer.toString());
        this.salesLineItems.forEach(salesLineItem -> build.append(salesLineItem.toString()));
        return build.toString();
    }

    @Override
    public boolean equals(Object o) {
        Sale u = (Sale) o;
        return u.getId().equals(this.getId());
    }

    public Double getAmountPayed() {
        return amountPayed;
    }

    public void setAmountPayed(Double amountPayed) {
        this.amountPayed = amountPayed;
    }
}
