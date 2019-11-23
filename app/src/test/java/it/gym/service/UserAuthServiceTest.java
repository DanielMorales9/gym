package it.gym.service;

import it.gym.model.AUser;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Collections;

import static it.gym.utility.Fixture.createCustomer;
import static it.gym.utility.Fixture.createCustomerRoles;
import static org.assertj.core.api.Assertions.assertThat;

@RunWith(SpringRunner.class)
public class UserAuthServiceTest {

    @MockBean private UserService userService;
    private static final String EMAIL = "admin@admin.com";

    @TestConfiguration
    static class UserAuthServiceTestContextConfiguration {

        @Bean
        public UserAuthService service() {
            return new UserAuthService();
        }
    }

    @Autowired
    private UserAuthService auth;

    @Test
    public void loadUserByUsername() {
        AUser customer = createCustomer(1L, EMAIL, "password", "admin", "admin", true, createCustomerRoles(), null);
        Mockito.when(userService.findByEmail(EMAIL)).thenAnswer(invocationOnMock -> customer);
        UserDetails u = auth.loadUserByUsername(EMAIL);
        assertThat(u.isEnabled()).isTrue();
        assertThat(u.getUsername()).isEqualTo(EMAIL);
        assertThat(u.getPassword()).isEqualTo("password");
        assertThat(u.getAuthorities()).isEqualTo(Collections.singleton(new SimpleGrantedAuthority("CUSTOMER")));
        Mockito.verify(userService).findByEmail(EMAIL);
    }

}
