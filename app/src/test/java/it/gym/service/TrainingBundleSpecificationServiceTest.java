package it.gym.service;

import it.gym.exception.NotFoundException;
import it.gym.model.APurchaseOption;
import it.gym.model.ATrainingBundleSpecification;
import it.gym.model.PersonalTrainingBundleSpecification;
import it.gym.repository.TrainingBundleSpecificationRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static it.gym.utility.Fixture.*;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;

@RunWith(SpringRunner.class)
public class TrainingBundleSpecificationServiceTest {

    @MockBean
    private TrainingBundleSpecificationRepository repository;

    @TestConfiguration
    static class TrainingBundleSpecificationServiceTestContextConfiguration {

        @Bean
        public TrainingBundleSpecificationService service() {
            return new TrainingBundleSpecificationService();
        }
    }

    @Autowired
    private TrainingBundleSpecificationService service;

    @Test
    public void save() {
        List<APurchaseOption> options = createSingletonBundlePurchaseOptions(30, 900.0);
        this.service.save(createPersonalBundleSpec(1L, "personal", options));
        Mockito.verify(repository).save(any(ATrainingBundleSpecification.class));
    }

    @Test
    public void existsByName() {
        this.service.existsByName("personal");
        Mockito.verify(repository).existsByName("personal");
    }

    @Test
    public void findById() {
        List<APurchaseOption> options = createSingletonBundlePurchaseOptions(30, 900.0);
        PersonalTrainingBundleSpecification spec = createPersonalBundleSpec(1L, "personal", options);

        Mockito.when(repository.findById(1L)).thenAnswer(invocationOnMock -> Optional.of(spec));
        ATrainingBundleSpecification u = this.service.findById(1L);

        assertThat(u).isEqualTo(spec);
        Mockito.verify(repository).findById(1L);
    }

    @Test
    public void findAll() {
        List<APurchaseOption> options = createSingletonBundlePurchaseOptions(30, 900.0);

        PersonalTrainingBundleSpecification personalBundleSpec = createPersonalBundleSpec(1L, "personal", options);
        Mockito.when(repository.findAll()).thenAnswer(invocationOnMock -> Collections.singletonList(personalBundleSpec));
        List<ATrainingBundleSpecification> u = this.service.findAll();
        assertThat(u).isEqualTo(Collections.singletonList(personalBundleSpec));
        Mockito.verify(repository).findAll();
    }

    @Test(expected = NotFoundException.class)
    public void whenFindByIdThrowsNotFound() {
        this.service.findById(1L);
    }

    @Test
    public void delete() {
        List<APurchaseOption> options = createSingletonBundlePurchaseOptions(30, 900.0);
        ATrainingBundleSpecification u = createPersonalBundleSpec(1L, "personal", options);
        this.service.delete(u);
        Mockito.verify(repository).delete(any(ATrainingBundleSpecification.class));
    }

}
