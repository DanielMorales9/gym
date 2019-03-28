package it.gym.model;

import javax.persistence.*;

@Entity
@Table(name="roles")
public class Role {
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

    @Override
    public boolean equals(Object o) {
        Role u = (Role) o;
        return u.getId().equals(this.getId());
    }
}
