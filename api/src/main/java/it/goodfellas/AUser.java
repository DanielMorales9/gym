package it.goodfellas;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name="users")
@Inheritance(strategy=InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name="user_type", discriminatorType=DiscriminatorType.STRING, length=1)
public abstract class AUser {

    @Id
    @SequenceGenerator(name = "users_user_id_seq",
            sequenceName = "users_user_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "users_user_id_seq")
    @Column(name="user_id")
    private Long id;

    @Column(name = "email", nullable = false, unique = true)
    @NotEmpty(message = "Email must not be empty")
    @Email(message = "Invalid Email")
    private String email;

    @Column(name = "password")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    @Column(name = "firstname", nullable = false)
    @NotNull
    @Size(min=2, max=30)
    private String firstName;

    @Column(name = "lastname", nullable = false)
    @NotNull
    @Size(min=2, max=30)
    private String lastName;

    @Column(name = "createdat", nullable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @Column(name = "updatedat")
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name="users_roles",
            uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "role_id"}),
            joinColumns = @JoinColumn(name="user_id", referencedColumnName="user_id"),
            inverseJoinColumns=@JoinColumn(name="role_id", referencedColumnName="role_id"))
    private List<Role> roles;


    private boolean isVerified;

    @PrePersist
    protected void prePersist() {
        this.createdAt = new Date();
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public List<Role> getRoles() {
        return roles;
    }

    public void setRoles(List<Role> roles) {
        this.roles = roles;
    }

    public boolean addRole(Role role) {
        if (this.roles == null) {
            this.roles = new ArrayList<>();
        }
        return this.roles.add(role);
    }

    @Override
    public String toString() {
        StringBuilder builder = new StringBuilder();
        builder.append("User: ");
        builder.append(this.firstName);
        builder.append(", ");
        builder.append(this.lastName);
        builder.append(", ");
        builder.append(this.email);
        return builder.toString();
    }

    abstract List<Long> getDefaultRoles();

    public boolean isVerified() {
        return this.isVerified;
    }

    public void setVerified(boolean verified) {
        isVerified = verified;
    }

    @Override
    public boolean equals(Object o) {
        AUser u = (AUser) o;
        return u.getId().equals(this.getId());
    }

}
