package it.gym.config;


import org.flywaydb.core.Flyway;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.security.crypto.password.PasswordEncoder;

import javax.sql.DataSource;

import static it.gym.config.FlywayConfig.DB_MIGRATION_TENANTS;

@TestConfiguration
public class ApplicationTestConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new PasswordEncoder() {

            @Override
            public String encode(CharSequence charSequence) {
                return charSequence.toString();
            }

            @Override
            public boolean matches(CharSequence charSequence, String s) {
                return charSequence.toString().equals(s);
            }

        };
    }

    @Bean
    public Flyway flyway(DataSource dataSource) {
        Flyway flyway = new Flyway();
        flyway.setLocations(DB_MIGRATION_TENANTS);
        flyway.setDataSource(dataSource);
        flyway.setSchemas("public");
        flyway.migrate();
        return flyway;
    }

}
