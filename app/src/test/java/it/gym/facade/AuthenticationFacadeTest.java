package it.gym.facade;

import it.gym.exception.InternalServerException;
import it.gym.model.*;
import it.gym.pojo.PasswordForm;
import it.gym.service.*;
import it.gym.utility.Fixture;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Collections;
import java.util.List;

import static it.gym.utility.Fixture.*;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;

@RunWith(SpringRunner.class)
public class AuthenticationFacadeTest {

    @MockBean private UserService userService;
    @MockBean private GymService gymService;
    @MockBean private MailService mailService;
    @MockBean private BCryptPasswordEncoder passwordEncoder;
    @MockBean private RoleService roleService;
    @MockBean
    @Qualifier("verificationTokenService")
    private VerificationTokenService tokenService;
    @MockBean private PasswordValidationService passwordValidationService;
    @Autowired private AuthenticationFacade facade;

    private static final String EMAIL = "admin@admin.com";

    @Test
    public void register() {
        // could be made simpler
        Mockito.when(gymService.findById(1L)).thenReturn(createGym(1L));
        Mockito.when(roleService.findAllById(Collections.singletonList(3L))).thenReturn(Fixture.createCustomerRoles());
        Mockito.doAnswer(invocationOnMock -> invocationOnMock.getArgument(0)).when(userService).save(any(AUser.class));
        Mockito.when(tokenService.createOrChangeVerificationToken(any(AUser.class)))
                .thenAnswer(invocationOnMock -> createToken(1L, "ababa", invocationOnMock.getArgument(0)));
        AUser user = facade.register(createCustomer(1L, EMAIL, "", "customer", "customer", true, Fixture.createCustomerRoles(), null), 1L);

        Mockito.verify(userService).existsByEmail(EMAIL);
        Mockito.verify(userService).save(user);
        Mockito.verify(mailService).sendSimpleMail(any(String.class), any(String.class), any(String.class));

        Gym gym = user.getGym();
        List<Role> roles = user.getRoles();

        assertThat(roles).isEqualTo(Fixture.createCustomerRoles());
        assertThat(gym).isEqualTo(createGym(1L));
    }

    @Test(expected = InternalServerException.class)
    public void whenRegisteringThrowsException() {
        Mockito.when(gymService.findById(1L)).thenReturn(createGym(1L));
        Mockito.when(roleService.findAllById(Collections.singletonList(3L))).thenReturn(Fixture.createCustomerRoles());
        Mockito.when(userService.existsByEmail("admin@admin.com")).thenReturn(true);
        facade.register(createCustomer(1L, EMAIL, "", "customer", "customer", true, Fixture.createCustomerRoles(), null), 1L);
    }

    @Test
    public void changePassword() {
        Mockito.doReturn(createCustomer(1L, EMAIL, "", "customer", "customer", true, Fixture.createCustomerRoles(), null)).when(userService).findById(1L);
        Mockito.doAnswer(invocationOnMock -> "c").when(passwordEncoder).encode(any());
        Mockito.doAnswer(invocationOnMock -> invocationOnMock.getArgument(0))
                .when(userService).save(any());
        AUser user = facade.changePassword(1L,
                new PasswordForm("a", "b", "b"));
        assertThat(user.getPassword()).isEqualTo("c");
    }

    @Test
    public void forgotPassword() {
        AUser customer = createCustomer(1L, EMAIL, "", "customer", "customer", true, Fixture.createCustomerRoles(), null);
        Mockito.doReturn(customer).when(userService).findByEmail(EMAIL);
        Mockito.doReturn(createToken(1L, "ababa", customer)).when(tokenService)
                .createOrChangeVerificationToken(customer);
        facade.forgotPassword(EMAIL);
        Mockito.verify(mailService).sendSimpleMail(any(String.class), any(String.class), any(String.class));
    }

    @Test
    public void getUserFromVerificationToken() {
        VerificationToken token = createToken(1L, "ababa", createCustomer(1L, EMAIL, "", "customer", "customer", true, Fixture.createCustomerRoles(), null));
        Mockito.doReturn(token).when(tokenService).findByToken("ababa");
        AUser user = facade.getUserFromVerificationToken(token.getToken());
        assertThat(user).isEqualTo(createCustomer(1L, EMAIL, "", "customer", "customer", true, Fixture.createCustomerRoles(), null));
    }

    @Test
    public void confirmRegistration() {
        Mockito.doReturn(createCustomer(1L, EMAIL, null, "customer", "customer", true, Fixture.createCustomerRoles(), null)).when(userService).findByEmail(EMAIL);
        Mockito.doAnswer(invocationOnMock -> invocationOnMock.getArgument(0))
                .when(userService).save(any());
        AUser user = facade.confirmRegistration(EMAIL, "a");
        assertThat(user).isEqualTo(createCustomer(1L, EMAIL, null, "customer", "customer", true, Fixture.createCustomerRoles(), null));
    }

    @Test
    public void resendAnonymousToken() {
        AUser customer = createCustomer(1L, EMAIL, "", "customer", "customer", true, Fixture.createCustomerRoles(), null);
        customer.setVerified(false);
        Mockito.doReturn(customer).when(userService).findById(1L);
        Mockito.when(tokenService.createOrChangeVerificationToken(customer))
                .thenAnswer(invocationOnMock -> createToken(1L, "ababa", invocationOnMock.getArgument(0)));
        AUser user = facade.resendAnonymousToken(1L);
        assertThat(user).isEqualTo(customer);
    }

    @Test
    public void resendExpiredToken() {
        AUser customer = createCustomer(1L, EMAIL, "", "customer", "customer", true, Fixture.createCustomerRoles(), null);
        Mockito.doReturn(createToken(1L, "ababa", customer)).when(tokenService).findByToken("ababa");
        AUser user = facade.resendToken("ababa");
        assertThat(user).isEqualTo(createCustomer(1L, EMAIL, "", "customer", "customer", true, Fixture.createCustomerRoles(), null));
    }

    @TestConfiguration
    static class AuthenticationFacadeTestContextConfiguration {

        @Bean
        public AuthenticationFacade facade() {
            return new AuthenticationFacade();
        }
    }
}
