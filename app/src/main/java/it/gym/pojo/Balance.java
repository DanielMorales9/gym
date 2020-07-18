package it.gym.pojo;

public class Balance {
    private Double totalPayed;
    private Double amountPayed;

    public Balance() {
        this.totalPayed = 0.;
        this.amountPayed = 0.;
    }

    public Balance(Double totalPayed, Double amountPayed) {
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

    public Balance sum(Balance b2) {
        return new Balance(this.totalPayed + b2.totalPayed,
                this.amountPayed + b2.amountPayed);
    }
}
