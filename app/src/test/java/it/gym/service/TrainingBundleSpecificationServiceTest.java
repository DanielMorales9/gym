package it.gym.service;

import it.gym.exception.NotFoundException;
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

import java.util.Optional;

import static it.gym.utility.Fixture.createPersonalBundleSpec;
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
        this.service.save(createPersonalBundleSpec(1L));
        Mockito.verify(repository).save(any(ATrainingBundleSpecification.class));
    }

    @Test
    public void findById() {
        Mockito.when(repository.findById(1L)).thenAnswer(invocationOnMock -> Optional.of(createPersonalBundleSpec(1L)));
        ATrainingBundleSpecification u = this.service.findById(1L);
        assertThat(u).isEqualTo(createPersonalBundleSpec(1L));
        Mockito.verify(repository).findById(1L);
    }

    @Test(expected = NotFoundException.class)
    public void whenFindByIdThrowsNotFound() {
        this.service.findById(1L);
    }

    @Test
    public void delete() {
        ATrainingBundleSpecification u = createPersonalBundleSpec(1L);
        this.service.delete(u);
        Mockito.verify(repository).delete(any(ATrainingBundleSpecification.class));
    }

}
