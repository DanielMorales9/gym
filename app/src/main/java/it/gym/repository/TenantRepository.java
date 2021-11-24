package it.gym.repository;

import it.gym.model.Admin;
import it.gym.model.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TenantRepository extends JpaRepository<Tenant, String> {

  boolean existsBySchemaName(String schemaName);

  Tenant findBySchemaName(String schemaName);
}
