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

import static it.gym.utility.Fixture.createPersonalBundle;
import static it.gym.utility.Fixture.createPersonalTrainingSession;
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
        this.service.save(createPersonalTrainingSession(1L, createPersonalBundle(1L)));
        Mockito.verify(repository).save(any(ATrainingSession.class));
    }

    @Test
    public void findById() {
        PersonalTrainingSession session = createPersonalTrainingSession(1L, createPersonalBundle(1L));
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
        ATrainingSession u = createPersonalTrainingSession(1L, createPersonalBundle(1L));
        this.service.delete(u);
        Mockito.verify(repository).delete(any(ATrainingSession.class));
    }
}
