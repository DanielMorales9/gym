package it.gym.config;

import org.flywaydb.core.Flyway;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.security.crypto.password.PasswordEncoder;

import javax.mail.internet.MimeMessage;
import javax.sql.DataSource;

import java.io.InputStream;

import static it.gym.config.FlywayConfig.DB_MIGRATION_TENANTS;

@TestConfiguration
public class ApplicationTestConfig {

  private final Logger logger = LoggerFactory.getLogger(getClass());

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
  public JavaMailSender mailSender() {
    return new JavaMailSender() {
      @Override
      public MimeMessage createMimeMessage() {
        logger.info("createMimeMessage");
        return null;
      }

      @Override
      public MimeMessage createMimeMessage(InputStream inputStream)
          throws MailException {
        logger.info("createMimeMessage");
        return null;
      }

      @Override
      public void send(MimeMessage mimeMessage) throws MailException {
        logger.info("send");
      }

      @Override
      public void send(MimeMessage... mimeMessages) throws MailException {
        logger.info("send");
      }

      @Override
      public void send(MimeMessagePreparator mimeMessagePreparator)
          throws MailException {
        logger.info("send");
      }

      @Override
      public void send(MimeMessagePreparator... mimeMessagePreparators)
          throws MailException {
        logger.info("send");
      }

      @Override
      public void send(SimpleMailMessage simpleMailMessage)
          throws MailException {
        logger.info("send");
      }

      @Override
      public void send(SimpleMailMessage... simpleMailMessages)
          throws MailException {
        logger.info("send");
      }
    };
  };

  @Bean
  public Flyway flyway(DataSource dataSource) {
    Flyway flyway =
        Flyway.configure()
            .dataSource(dataSource)
            .schemas("public")
            .locations(DB_MIGRATION_TENANTS)
            .load();
    flyway.migrate();
    return flyway;
  }
}
