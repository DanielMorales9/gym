package it.gym.service;

import it.gym.exception.NotFoundException;
import it.gym.model.Payment;
import it.gym.repository.PaymentRepository;
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

import static it.gym.utility.Fixture.createPayment;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;

@RunWith(SpringRunner.class)
public class PaymentServiceTest {

    @MockBean
    private PaymentRepository repository;

    @Autowired
    private PaymentService service;

    Date date = new Date();

    @Test
    public void save() {
        this.service.save(createPayment(1L, 10., date));
        Mockito.verify(repository).save(any(Payment.class));
    }

    @Test
    public void findById() {
        Mockito.when(repository.findById(1L)).thenAnswer(invocationOnMock -> Optional.of(createPayment(1L, 10., date)));
        Payment u = this.service.findById(1L);
        assertThat(u).isEqualTo(createPayment(1L, 10., date));
        Mockito.verify(repository).findById(1L);
    }

    @Test
    public void findAll() {
        Mockito.when(repository.findAll()).thenAnswer(invocationOnMock -> Collections.singletonList(createPayment(1L, 10., date)));
        List<Payment> u = this.service.findAll();
        assertThat(u).isEqualTo(Collections.singletonList(createPayment(1L, 10., date)));
        Mockito.verify(repository).findAll();
    }

    @Test(expected = NotFoundException.class)
    public void whenFindByIdThrowsNotFound() {
        this.service.findById(1L);
    }

    @Test
    public void delete() {
        Payment u = createPayment(1L, 10., date);
        this.service.delete(u);
        Mockito.verify(repository).delete(any(Payment.class));
    }

    @TestConfiguration
    static class PaymentServiceTestContextConfiguration {

        @Bean
        public PaymentService service() {
            return new PaymentService();
        }
    }
}
