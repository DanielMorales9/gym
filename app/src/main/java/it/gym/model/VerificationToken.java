package it.gym.model;

import javax.persistence.*;
import java.util.Calendar;
import java.util.Date;

@Entity
@Table(name = "verify_token")
public class VerificationToken {

    public static final int EXPIRATION = 60 * 24;

    @Id
    @SequenceGenerator(name = "verify_token_id_seq",
            sequenceName = "verify_token_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "verify_token_id_seq")
    @Column(name="token_id")
    private Long id;

    private String token;

    @OneToOne(targetEntity = AUser.class,
            fetch = FetchType.EAGER,
            cascade = CascadeType.MERGE)
    @JoinColumn(nullable = false, name = "user_id")
    private AUser user;

    @Temporal(TemporalType.TIMESTAMP)
    private Date expiryDate;

    public VerificationToken() {}

    public AUser getUser() {
        return user;
    }

    public void setUser(AUser user) {
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Date getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(Date expiryDate) {
        this.expiryDate = expiryDate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Override
    public boolean equals(Object o) {
        VerificationToken u = (VerificationToken) o;
        return u != null && u.getId().equals(this.getId());
    }

    public boolean isExpired() {
        Calendar cal = Calendar.getInstance();
        return this.expiryDate.getTime() - cal.getTime().getTime() <= 0;
    }
}
