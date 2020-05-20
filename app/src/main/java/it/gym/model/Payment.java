package it.gym.model;


import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Generated;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Entity
@Table(name = "payments")
@Data
@EqualsAndHashCode
@Generated //exclude coverage analysis on generated methods
public class Payment implements Serializable, Eager {

    @Id
    @SequenceGenerator(name = "payment_id_seq",
            sequenceName = "payment_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "payment_id_seq")
    @Column(name="payment_id")
    private Long id;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @Column(name = "amount", nullable = false)
    private Double amount;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    @PrePersist
    public void prePersist() {
        this.createdAt = new Date();
    }

    @Override
    public void eager() {
        return;
    }
}
