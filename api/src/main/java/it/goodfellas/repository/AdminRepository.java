package it.goodfellas.repository;

import it.goodfellas.model.AUser;
import it.goodfellas.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource
public interface AdminRepository extends JpaRepository<Admin, Long> {


    Admin findByEmail(String email);

}
