package it.gym.service;

import it.gym.config.FlywayConfig;
import it.gym.exception.ConflictException;
import it.gym.exception.NotFoundException;
import it.gym.model.Tenant;
import it.gym.repository.TenantRepository;
import lombok.extern.flogger.Flogger;
import org.flywaydb.core.Flyway;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.sql.DataSource;

@Service
@Transactional
public class TenantService {

    private Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    private TenantRepository repository;

    @Autowired
    private DataSource dataSource;

    public Boolean existsByTenant(Tenant tenant) {
        return repository.existsBySchemaName(tenant.getSchemaName());
    }

    public Tenant findTenantBySchemaName(String schemaName) {
        return repository.findBySchemaName(schemaName);
    }

    public Tenant setTenantSchema(Tenant tenant) {
        String tenantName = tenant.getTenantName();
        if (tenant.getSchemaName() == null) tenant.setSchemaName(String.format("tenant_%s", tenantName));

        String schemaName = tenant.getSchemaName();

        // checking whether tenant already exists
        if (repository.existsBySchemaName(schemaName)) {
            throw new ConflictException(String.format("Esiste già una palestra con nome %s", tenantName));
        }
        tenant.setSchemaName(schemaName);
        return tenant;
    }

    public Tenant createTenant(Tenant tenant) {
        tenant = this.setTenantSchema(tenant);
        tenant = repository.save(tenant);
        String schema = tenant.getSchemaName();
        Flyway flyway = Flyway.configure()
                .dataSource(dataSource)
                .schemas(schema)
                .locations(FlywayConfig.DB_MIGRATION_TENANTS)
                .load();
        flyway.migrate();
        return tenant;
    }

    public void deleteById(String uuid) {
        repository.deleteById(uuid);
    }

    public Page<Tenant> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }
}
