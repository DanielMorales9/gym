package it.gym.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Generated;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name="roles")
@Data
@EqualsAndHashCode
@Generated //exclude coverage analysis on generated methods
public class Role implements Serializable {

    @Id
    @SequenceGenerator(name = "roles_role_id_seq",
            sequenceName = "roles_role_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "roles_role_id_seq")
    @Column(name="role_id")
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    public Role() {

    }

    public Role(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

}
