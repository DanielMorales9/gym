package it.gym.facade;

import it.gym.repository.PurchaseOptionRepository;
import it.gym.service.EventService;
import it.gym.service.TrainingBundleService;
import it.gym.service.TrainingBundleSpecificationService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
public class TrainingBundleSpecificationServiceTest {

  @MockBean private TrainingBundleSpecificationService service;

  @MockBean private PurchaseOptionRepository repository;

  @MockBean private EventService eventService;

  @MockBean
  @Qualifier("trainingBundleService")
  private TrainingBundleService bundleService;

  @TestConfiguration
  static class TrainingBundleSpecificationFacadeTestContextConfiguration {

    @Bean
    public TrainingBundleSpecificationFacade facade() {
      return new TrainingBundleSpecificationFacade();
    }
  }

  @Autowired private TrainingBundleSpecificationFacade facade;

  @Test
  public void existsByName() {
    this.facade.existsByName("personal");
    Mockito.verify(service).existsByName("personal");
  }
}
