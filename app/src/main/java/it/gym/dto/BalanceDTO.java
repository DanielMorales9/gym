package it.gym.dto;

public class BalanceDTO {
  private Double totalPayed;
  private Double amountPayed;

  public BalanceDTO() {
    this.totalPayed = 0.;
    this.amountPayed = 0.;
  }

  public BalanceDTO(Double totalPayed, Double amountPayed) {
    this.totalPayed = totalPayed;
    this.amountPayed = amountPayed;
  }

  public Double getTotalPayed() {
    return totalPayed;
  }

  public void setTotalPayed(Double totalPayed) {
    this.totalPayed = totalPayed;
  }

  public Double getAmountPayed() {
    return amountPayed;
  }

  public void setAmountPayed(Double amountPayed) {
    this.amountPayed = amountPayed;
  }

  public BalanceDTO sum(BalanceDTO b2) {
    return new BalanceDTO(
        this.totalPayed + b2.totalPayed, this.amountPayed + b2.amountPayed);
  }
}
