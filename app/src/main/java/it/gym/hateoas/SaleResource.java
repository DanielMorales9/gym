package it.gym.hateoas;

import com.fasterxml.jackson.annotation.JsonProperty;
import it.gym.model.*;
import org.springframework.hateoas.RepresentationModel;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

public class SaleResource extends RepresentationModel<SaleResource> {

  private final Long id;
  private final Double amountPayed;
  private final Double totalPrice;
  private final Boolean deletable;
  private final Boolean payed;
  private final Boolean completed;
  private final Date payedDate;
  private final Date createdAt;
  private final List<Payment> payments;
  private final UserResource customer;
  private final List<SalesLineItemResource> salesLineItems;

  public SaleResource(Sale model) {
    id = model.getId();
    amountPayed = model.getAmountPayed();
    createdAt = model.getCreatedAt();
    deletable = model.isDeletable();
    payed = model.isPayed();
    completed = model.isCompleted();
    payedDate = model.getPayedDate();
    totalPrice = model.getTotalPrice();
    payments = model.getPayments();
    customer = new UserResource(model.getCustomer());
    this.salesLineItems = getSalesLineItems(model);
  }

  private List<SalesLineItemResource> getSalesLineItems(Sale model) {
    return model.getSalesLineItems().stream()
        .map(SalesLineItemResource::new)
        .collect(Collectors.toList());
  }

  @JsonProperty("id")
  public Long getSaleId() {
    return id;
  }

  public Double getAmountPayed() {
    return amountPayed;
  }

  public Double getTotalPrice() {
    return totalPrice;
  }

  public Boolean getDeletable() {
    return deletable;
  }

  public Boolean getPayed() {
    return payed;
  }

  public Boolean getCompleted() {
    return completed;
  }

  public Date getPayedDate() {
    return payedDate;
  }

  public Date getCreatedAt() {
    return createdAt;
  }

  public List<Payment> getPayments() {
    return payments;
  }

  public UserResource getCustomer() {
    return customer;
  }

  public List<SalesLineItemResource> getSalesLineItems() {
    return salesLineItems;
  }

  private static class SalesLineItemResource
      extends RepresentationModel<SalesLineItemResource> {

    private final Long id;
    private final SalesLineItemTrainingBundle trainingBundle;
    private final InnerTrainingBundleSpecificationResource bundleSpecification;

    SalesLineItemResource(SalesLineItem model) {
      id = model.getId();
      trainingBundle =
          new SalesLineItemTrainingBundle(model.getTrainingBundle());
      bundleSpecification =
          new InnerTrainingBundleSpecificationResource(
              model.getBundleSpecification());
    }

    @JsonProperty("id")
    public Long getSalesLineItemId() {
      return id;
    }

    public SalesLineItemTrainingBundle getTrainingBundle() {
      return trainingBundle;
    }

    public InnerTrainingBundleSpecificationResource getBundleSpecification() {
      return bundleSpecification;
    }
  }

  private static class SalesLineItemTrainingBundle
      extends RepresentationModel<SalesLineItemTrainingBundle> {

    private final Long id;
    private final String name;
    private final SalesLineItemTrainingBundleOption option;

    public SalesLineItemTrainingBundle(ATrainingBundle trainingBundle) {
      id = trainingBundle.getId();
      name = trainingBundle.getName();
      option =
          new SalesLineItemTrainingBundleOption(trainingBundle.getOption());
    }

    @JsonProperty("id")
    public Long getBundleId() {
      return id;
    }

    public SalesLineItemTrainingBundleOption getOption() {
      return option;
    }

    public String getName() {
      return name;
    }
  }

  private static class SalesLineItemTrainingBundleOption
      extends RepresentationModel<SalesLineItemTrainingBundleOption> {

    private final Long id;
    private final Double price;

    public SalesLineItemTrainingBundleOption(APurchaseOption option) {
      this.id = option.getId();
      this.price = option.getPrice();
    }

    @JsonProperty("id")
    public Long getOptionId() {
      return id;
    }

    public Double getPrice() {
      return price;
    }
  }
}
