package it.gym;

import it.gym.config.ApplicationTestConfig;
import it.gym.config.CustomPostgresContainer;
import org.junit.ClassRule;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.junit4.SpringRunner;

import static org.assertj.core.api.AssertionsForInterfaceTypes.assertThat;
import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = RANDOM_PORT)
@Import(ApplicationTestConfig.class)
public class SpringContextTest {

  private final Logger logger = LoggerFactory.getLogger(getClass());

  @ClassRule
  public static CustomPostgresContainer sqlContainer =
      CustomPostgresContainer.getInstance();

  @Test
  public void whenSpringContextIsBootstrapped_thenNoExceptions() {
    assertThat(true).isTrue();
  }
}
