package it.gym.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.containers.wait.strategy.Wait;

import java.io.IOException;

public class CustomPostgresContainer extends PostgreSQLContainer<CustomPostgresContainer> {

    private static final String IMAGE_VERSION = "postgres:10-alpine";
    private static CustomPostgresContainer container;

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private CustomPostgresContainer() {
        super(IMAGE_VERSION);
    }
 
    public static CustomPostgresContainer getInstance() {
        if (container == null) {
            container = new CustomPostgresContainer()
                    .withPassword("test")
                    .withUsername("goodfellas")
                    .withDatabaseName("test")
                    .waitingFor(
                            Wait.forLogMessage(".*ready to accept connections.*\\n", 1)
                    );
        }
        return container;
    }

    @Override
    public void start() {
        logger.info("POSTGRES STARTED");
        super.start();
        System.setProperty("DB_URL", container.getJdbcUrl());
        System.setProperty("DB_USERNAME", container.getUsername());
        System.setProperty("DB_PASSWORD", container.getPassword());
    }

    @Override
    public void stop() {
        logger.info("POSTGRES STOPPED");
    }
}
