package it.gym.service;

import com.google.common.base.Joiner;
import it.gym.exception.BadRequestException;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.passay.PasswordData;
import org.passay.RuleResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
public class PasswordValidationServiceTest {

  @TestConfiguration
  static class PasswordValidationTestContextConfiguration {

    @Bean
    public PasswordValidationService service() {
      return new PasswordValidationService();
    }
  }

  @Autowired PasswordValidationService service;

  @Test
  public void validate() {
    service.validate("password");
  }

  @Test(expected = BadRequestException.class)
  public void invalid() {
    service.validate("pas");
  }
}
