package it.gym.service;

import static it.gym.utility.Fixture.*;
import static org.assertj.core.api.Assertions.assertThat;

import it.gym.model.APurchaseOption;
import it.gym.model.ATrainingBundle;
import it.gym.model.PersonalTrainingBundleSpecification;
import it.gym.repository.TrainingBundleRepository;
import java.util.Collections;
import java.util.List;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
public class TrainingBundleServiceTest {

  @MockBean private TrainingBundleRepository repository;

  @TestConfiguration
  static class TrainingBundleServiceTestContextConfiguration {

    @Bean
    public TrainingBundleService service() {
      return new TrainingBundleService();
    }
  }

  @Autowired private TrainingBundleService service;

  @Test
  public void findAll() {

    List<APurchaseOption> options =
        createSingletonBundlePurchaseOptions(30, 900.0, null);
    PersonalTrainingBundleSpecification pe =
        createPersonalBundleSpec(1L, "personal", options);
    ATrainingBundle bundle =
        createPersonalBundle(1L, pe, pe.getOptions().get(0));
    Mockito.when(repository.findAll())
        .thenAnswer(invocationOnMock -> Collections.singletonList(bundle));
    List<ATrainingBundle> u = this.service.findAll();
    assertThat(u).isEqualTo(Collections.singletonList(bundle));
    Mockito.verify(repository).findAll();
  }
}
