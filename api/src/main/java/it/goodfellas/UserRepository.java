package it.goodfellas;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported = false, path = "/users")
public interface UserRepository extends JpaRepository<AUser, Long> {

    AUser findByEmail(String email);

}
