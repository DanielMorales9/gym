package it.gym.service;

import it.gym.exception.NotFoundException;
import it.gym.model.*;
import it.gym.repository.TrainingSessionRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Date;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;

@RunWith(SpringRunner.class)
public class TrainingSessionServiceTest {

    @MockBean
    private TrainingSessionRepository repository;

    @TestConfiguration
    static class TrainingSessionServiceTestContextConfiguration {

        @Bean
        public TrainingSessionService service() {
            return new TrainingSessionService();
        }
    }

    @Autowired
    private TrainingSessionService service;

    @Test
    public void save() {
        this.service.save(createSession(createBundleSpec()));
        Mockito.verify(repository).save(any(ATrainingSession.class));
    }

    @Test
    public void findById() {
        PersonalTrainingSession session = createSession(createBundleSpec());
        Mockito.when(repository.findById(1L)).thenAnswer(invocationOnMock -> Optional.of(session));
        ATrainingSession u = this.service.findById(1L);
        assertThat(u).isEqualTo(session);
        Mockito.verify(repository).findById(1L);
    }

    @Test(expected = NotFoundException.class)
    public void whenFindByIdThrowsNotFound() {
        this.service.findById(1L);
    }

    @Test
    public void delete() {
        ATrainingSession u = createSession(createBundleSpec());
        this.service.delete(u);
        Mockito.verify(repository).delete(any(ATrainingSession.class));
    }

    private PersonalTrainingSession createSession(ATrainingBundle bundleSpec) {
        PersonalTrainingSession pt = new PersonalTrainingSession();
        pt.setCompleted(false);
        pt.setStartTime(new Date());
        pt.setEndTime(new Date());
        pt.setId(1L);
        pt.setTrainingBundle(bundleSpec);
        return pt;
    }

    private ATrainingBundle createBundleSpec() {
        PersonalTrainingBundle pt = new PersonalTrainingBundle();
        pt.setName("Winter Pack");
        pt.setNumSessions(11);
        pt.setPrice(111.0);
        pt.setDescription("Description");
        pt.setId(1L);
        return pt;
    }
}
