package it.gym.config;

import it.gym.repository.TenantRepository;
import org.flywaydb.core.Flyway;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;
import org.springframework.scheduling.annotation.EnableScheduling;

import javax.sql.DataSource;

@Configuration
@EnableScheduling
@ConditionalOnProperty(
    name = "it.gym.enabled",
    havingValue = "true",
    matchIfMissing = true)
public class FlywayConfig {

  public static final String DEFAULT_SCHEMA = "default_schema";
  private static final String DB_MIGRATION_DEFAULT = "db/migration/default";
  public static final String DB_MIGRATION_TENANTS = "db/migration/tenants";

  private final Logger logger = LoggerFactory.getLogger(getClass());

  @Bean
  public Flyway flyway(DataSource dataSource) {
    logger.info("Migrating default schema");
    Flyway flyway =
        Flyway.configure()
            .dataSource(dataSource)
            .schemas(DEFAULT_SCHEMA)
            .locations(DB_MIGRATION_DEFAULT)
            .load();
    flyway.migrate();
    return flyway;
  }

  @Bean
  @DependsOn("flyway")
  public Boolean tenantsFlyway(
      TenantRepository repository, DataSource dataSource) {
    logger.info("Migrating tenants schema");
    repository
        .findAll()
        .forEach(
            tenant -> {
              String schema = tenant.getSchemaName();
              Flyway flyway =
                  Flyway.configure()
                      .dataSource(dataSource)
                      .schemas(schema)
                      .locations(DB_MIGRATION_TENANTS)
                      .load();
              flyway.migrate();
            });
    return true;
  }
}
