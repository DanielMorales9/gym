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
import java.util.List;
import java.util.Optional;

import static it.gym.utility.Fixture.createCustomer;
import static it.gym.utility.Fixture.createReservation;
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
        Reservation reservation = createReservation(1L, null);
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
        Reservation reservation = createReservation(1L, null);
        Mockito.doReturn(Optional.of(reservation)).when(repository).findById(1L);
        assertThat(service.findById(1L)).isNotNull();
        Mockito.verify(repository).findById(1L);
    }

    @Test
    public void delete() {
        service.delete(createReservation(1L, null));
        Mockito.verify(repository).delete(any());
    }

    @Test
    public void deleteAll() {
        Customer customer = (Customer) createCustomer(1L, "customer@customer.com", "", "customer", "customer", true, null, null);
        List<Reservation> list = Collections.singletonList(createReservation(1L, customer));
        service.deleteAll(list);
        Mockito.verify(repository).deleteAll(list);
    }


//    @Test
//    public void findByIntervalAndId() {
//        Date startTime = new Date();
//        Date endTime = new Date();
//        List<Reservation> toBeReturned = Collections.singletonList(createReservation());
//        Mockito.doReturn(toBeReturned).when(repository).findByInterval(any(), any(), any());
//        List<Reservation> list = service.findByIntervalAndId(1L, startTime, endTime);
//        assertThat(list.size()).isEqualTo(1);
//    }

//    @Test
//    public void findByIntervalAndIdNoReservation() {
//        Date startTime = new Date();
//        Date endTime = new Date();
//        Mockito.doReturn(Collections.emptyList()).when(repository).findAll();
//        List<Reservation> list = service.findByIntervalAndId(1L, startTime, endTime);
//        assertThat(list.size()).isEqualTo(0);
//    }

//    @Test
//    public void findAllEvents() {
//        Date startTime = new Date();
//        Date endTime = new Date();
//        List<Reservation> toBeReturned = Collections.singletonList(createReservation());
//        Mockito.doReturn(toBeReturned).when(repository).findByInterval(startTime, endTime);
//        List<Reservation> list = service.findByInterval(startTime, endTime);
//        assertThat(list.size()).isEqualTo(1);
//    }
//
//    @Test
//    public void findAllEventsNoEvents() {
//        Date startTime = new Date();
//        Date endTime = new Date();
//        List<Reservation> toBeReturned = Collections.emptyList();
//        Mockito.doReturn(toBeReturned).when(repository).findByInterval(startTime, endTime);
//        List<Reservation> list = service.findByInterval(startTime, endTime);
//        assertThat(list.size()).isEqualTo(0);
//    }

    @Test
    public void findAll() {
        List<Reservation> toBeReturned = Collections.singletonList(createReservation(1L, null));
        Mockito.doReturn(toBeReturned).when(repository).findAll();
        List<Reservation> list = service.findAll();
        assertThat(list.size()).isEqualTo(1);
    }
}
