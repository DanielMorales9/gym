package it.gym.service;

import it.gym.exception.NotFoundException;
import it.gym.model.*;
import it.gym.repository.ReservationRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.apache.commons.lang3.time.DateUtils.addHours;
import static org.assertj.core.api.AssertionsForClassTypes.anyOf;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.ArgumentMatchers.any;

@RunWith(SpringRunner.class)
public class ReservationServiceTest {

    @MockBean
    private ReservationRepository repository;

    @TestConfiguration
    static class ReservationServiceTestContextConfiguration {

        @Bean
        public ReservationService service() {
            return new ReservationService();
        }
    }

    @Autowired
    ReservationService service;

    @Test
    public void save() {
        Reservation reservation = createReservation(new Date(), new Date());
        service.save(reservation);
        Mockito.verify(repository).save(reservation);
    }

    @Test(expected = NotFoundException.class)
    public void findByIdNotFound() {
        service.findById(1L);
        Mockito.verify(repository).findById(1L);
    }

    @Test
    public void findById() {
        Reservation reservation = createReservation(new Date(), new Date());
        Mockito.doReturn(Optional.of(reservation)).when(repository).findById(1L);
        assertThat(service.findById(1L)).isNotNull();
        Mockito.verify(repository).findById(1L);
    }

    @Test
    public void delete() {
        service.delete(createReservation( new Date(), new Date()));
        Mockito.verify(repository).delete(any());
    }


    @Test
    public void findByIntervalAndId() {
        Date startTime = new Date();
        Date endTime = new Date();
        List<Reservation> toBeReturned = Collections.singletonList(createReservation(startTime, endTime));
        Mockito.doReturn(toBeReturned).when(repository).findByInterval(any(), any(), any());
        List<Reservation> list = service.findByIntervalAndId(1L, startTime, endTime);
        assertThat(list.size()).isEqualTo(1);
    }

    @Test
    public void findByIntervalAndIdNoReservation() {
        Date startTime = new Date();
        Date endTime = new Date();
        Mockito.doReturn(Collections.emptyList()).when(repository).findAll();
        List<Reservation> list = service.findByIntervalAndId(1L, startTime, endTime);
        assertThat(list.size()).isEqualTo(0);
    }

    @Test
    public void findAllEvents() {
        Date startTime = new Date();
        Date endTime = new Date();
        List<Reservation> toBeReturned = Collections.singletonList(createReservation(startTime, endTime));
        Mockito.doReturn(toBeReturned).when(repository).findByInterval(startTime, endTime);
        List<Reservation> list = service.findByInterval(startTime, endTime);
        assertThat(list.size()).isEqualTo(1);
    }

    @Test
    public void findAllEventsNoEvents() {
        Date startTime = new Date();
        Date endTime = new Date();
        List<Reservation> toBeReturned = Collections.emptyList();
        Mockito.doReturn(toBeReturned).when(repository).findByInterval(startTime, endTime);
        List<Reservation> list = service.findByInterval(startTime, endTime);
        assertThat(list.size()).isEqualTo(0);
    }

    @Test
    public void countByInterval() {
        Date startTime = new Date();
        Date endTime = new Date();
        Mockito.doReturn(1).when(repository).countByInterval(startTime, endTime);
        Integer actual = service.countByInterval(startTime, endTime);
        assertThat(actual).isEqualTo(1);
    }

    @Test
    public void findAll() {
        Date startTime = new Date();
        Date endTime = new Date();
        List<Reservation> toBeReturned = Collections.singletonList(createReservation(startTime, endTime));
        Mockito.doReturn(toBeReturned).when(repository).findAll();
        List<Reservation> list = service.findAll();
        assertThat(list.size()).isEqualTo(1);
    }

    private Reservation createReservation(Date startTime, Date endTime) {
        Reservation reservation = new Reservation();
        reservation.setStartTime(startTime);
        reservation.setEndTime(endTime);
        reservation.setId(1L);
        return reservation;
    }


}
