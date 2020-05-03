package it.gym.facade;

import it.gym.model.AUser;
import it.gym.model.VerificationToken;
import it.gym.repository.ImageRepository;
import it.gym.service.UserService;
import it.gym.service.VerificationTokenService;
import it.gym.utility.Fixture;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Date;

import static org.apache.commons.lang3.time.DateUtils.addHours;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@RunWith(SpringRunner.class)
public class UserFacadeTest {

    @MockBean
    private UserService userService;

    @MockBean
    @Qualifier("verificationTokenService")
    private VerificationTokenService tokenService;

    @MockBean
    private ImageRepository imageRepository;

    @Autowired
    private UserFacade userFacade;

    @Test
    public void findById() {
        Mockito.doReturn(Fixture.createCustomer(1L, "customer@customer.com", "", "customer", "customer", true, null)).when(userService).findById(1L);
        AUser user = userFacade.findById(1L);
        assertThat(user).isEqualTo(Fixture.createCustomer(1L, "customer@customer.com", "", "customer", "customer", true, null));
    }

    @Test
    public void delete() {
        AUser customer = Fixture.createCustomer(1L, "customer@customer.com", "", "customer", "customer", true, null);
        Mockito.doReturn(customer).when(userService).findById(1L);
        VerificationToken token = Fixture.createToken(1L, "ababa", customer, addHours(new Date(), 2));
        Mockito.doReturn(token).when(tokenService).findByUser(customer);
        Mockito.doReturn(true).when(tokenService).existsByUser(customer);

        AUser user = userFacade.delete(1L);
        Mockito.verify(tokenService).delete(token);

        assertThat(user).isEqualTo(customer);
    }

    @Test
    public void save() {
        AUser customer = Fixture.createCustomer(1L, "customer@customer.com", "", "customer", "customer", true, null);
        Mockito.doAnswer(invocationOnMock -> invocationOnMock.getArgument(0)).when(userService).save(customer);
        AUser user = userFacade.save(customer);
        assertThat(user).isEqualTo(customer);
    }

    @Test
    public void findByEmail() {
        AUser customer = Fixture.createCustomer(1L, "customer@customer.com", "", "customer", "customer", true, null);
        String email = "customer@customer.com";
        Mockito.doReturn(customer).when(userService).findByEmail(email);
        AUser user = userFacade.findByEmail(email);
        assertThat(user).isEqualTo(customer);
    }

    @TestConfiguration
    static class UserFacadeTestContextConfiguration {

        @Bean
        public UserFacade userFacade() {
            return new UserFacade();
        }
    }
}
