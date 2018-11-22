package it.goodfellas.repository;

import it.goodfellas.model.AUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(path = "/users")
public interface UserRepository extends JpaRepository<AUser, Long> {

    AUser findByEmail(String email);

    Page<AUser> findByLastName(String query, Pageable pageable);

}
