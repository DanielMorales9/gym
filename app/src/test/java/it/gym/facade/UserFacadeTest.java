package it.gym.facade;

import it.gym.model.AUser;
import it.gym.model.Customer;
import it.gym.model.VerificationToken;
import it.gym.service.UserService;
import it.gym.service.VerificationTokenService;
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
    @Autowired
    private UserFacade userFacade;

    @Test
    public void findById() {
        Mockito.doReturn(createCustomer()).when(userService).findById(1L);
        AUser user = userFacade.findById(1L);
        assertThat(user).isEqualTo(createCustomer());
    }

    @Test
    public void delete() {
        AUser customer = createCustomer();
        Mockito.doReturn(customer).when(userService).findById(1L);
        Mockito.doReturn(createToken(customer)).when(tokenService).findByUser(customer);

        AUser user = userFacade.delete(1L);
        Mockito.verify(tokenService).delete(createToken(customer));

        assertThat(user).isEqualTo(customer);
    }

    @Test
    public void save() {
        AUser customer = createCustomer();
        Mockito.doAnswer(invocationOnMock -> invocationOnMock.getArgument(0)).when(userService).save(customer);
        AUser user = userFacade.save(customer);
        assertThat(user).isEqualTo(customer);
    }

    @Test
    public void findByEmail() {
        AUser customer = createCustomer();
        String email = "customer@customer.com";
        Mockito.doReturn(customer).when(userService).findByEmail(email);
        AUser user = userFacade.findByEmail(email);
        assertThat(user).isEqualTo(customer);
    }

    private VerificationToken createToken(AUser u) {
        VerificationToken vk = new VerificationToken();
        vk.setId(1L);
        vk.setToken("ababa");
        vk.setExpiryDate(addHours(new Date(), 2));
        vk.setUser(u);
        return vk;
    }

    private AUser createCustomer() {
        AUser user = new Customer();
        user.setId(1L);
        user.setEmail("customer@customer.com");
        user.setFirstName("customer");
        user.setLastName("customer");
        return user;
    }

    @TestConfiguration
    static class UserFacadeTestContextConfiguration {

        @Bean
        public UserFacade userFacade() {
            return new UserFacade();
        }
    }
}
