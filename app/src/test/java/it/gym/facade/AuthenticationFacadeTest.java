package it.gym.facade;

import it.gym.config.CustomProperties;
import it.gym.exception.BadRequestException;
import it.gym.exception.InternalServerException;
import it.gym.exception.NotFoundException;
import it.gym.exception.UnAuthorizedException;
import it.gym.model.AUser;
import it.gym.model.Gym;
import it.gym.model.Role;
import it.gym.model.VerificationToken;
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
import org.springframework.mail.MailSendException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Collections;
import java.util.Date;
import java.util.List;

import static it.gym.utility.Fixture.*;
import static org.apache.commons.lang3.time.DateUtils.addHours;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;

@RunWith(SpringRunner.class)
public class AuthenticationFacadeTest {

    @MockBean private UserService userService;
    @MockBean private GymService gymService;
    @MockBean @Qualifier("mailService") private MailService mailService;
    @MockBean private BCryptPasswordEncoder passwordEncoder;
    @MockBean private RoleService roleService;
    @MockBean private CustomProperties properties;
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
                .thenAnswer(invocationOnMock -> createToken(1L, "ababa", invocationOnMock.getArgument(0), addHours(new Date(), 2)));
        AUser user = facade.register(createCustomer(1L, EMAIL, "", "customer", "customer", true, Fixture.createCustomerRoles()));

        Mockito.verify(userService).existsByEmail(EMAIL);
        Mockito.verify(userService).save(user);
        Mockito.verify(mailService).sendSimpleMail(any(String.class), any(String.class), any(String.class));

        List<Role> roles = user.getRoles();

        assertThat(roles).isEqualTo(Fixture.createCustomerRoles());
    }

    @Test(expected = InternalServerException.class)
    public void whenRegisteringThrowsException() {
        Mockito.when(gymService.findById(1L)).thenReturn(createGym(1L));
        Mockito.when(roleService.findAllById(Collections.singletonList(3L))).thenReturn(createCustomerRoles());
        Mockito.when(userService.existsByEmail("admin@admin.com")).thenReturn(true);
        facade.register(createCustomer(1L, EMAIL, "", "customer", "customer", true, createCustomerRoles()));
    }

    @Test(expected = InternalServerException.class)
    public void whenRegisteringEmailSenderThrowsException() {
        Gym gym = createGym(1L);
        List<Role> roles = createCustomerRoles();
        AUser customer = createCustomer(1L, EMAIL, "", "customer", "customer", false, roles);
        VerificationToken token = createToken(1L, "ababa", customer, addHours(new Date(), 2));
        Mockito.doThrow(new MailSendException("Test message"))
                .when(mailService).sendSimpleMail(anyString(), anyString(), anyString());
        Mockito.when(gymService.findById(1L)).thenReturn(gym);
        Mockito.when(roleService.findAllById(Collections.singletonList(3L))).thenReturn(roles);
        Mockito.doAnswer(invocationOnMock -> invocationOnMock.getArgument(0)).when(userService).save(any());
        Mockito.doReturn(token).when(tokenService).createOrChangeVerificationToken(any());

        facade.register(customer);
        Mockito.verify(mailService).sendSimpleMail(anyString(), anyString(), anyString());
        Mockito.verify(tokenService).delete(token);
        Mockito.verify(userService).deleteById(1L);
    }

    @Test
    public void changePassword() {
        Mockito.doReturn(createCustomer(1L, EMAIL, "", "customer", "customer", true, Fixture.createCustomerRoles())).when(userService).findById(1L);
        Mockito.doAnswer(invocationOnMock -> "c").when(passwordEncoder).encode(any());
        Mockito.doAnswer(invocationOnMock -> invocationOnMock.getArgument(0))
                .when(userService).save(any());
        AUser user = facade.changePassword(1L,
                new PasswordForm("a", "b", "b"));
        assertThat(user.getPassword().equals("c")).isTrue();
    }

    @Test(expected = BadRequestException.class)
    public void whenChangePassword_PasswordNotEqual() {
        Mockito.doReturn(createCustomer(1L, EMAIL, "", "customer", "customer", true, Fixture.createCustomerRoles())).when(userService).findById(1L);
        Mockito.doAnswer(invocationOnMock -> "d").when(passwordEncoder).encode(any());
        Mockito.doAnswer(invocationOnMock -> invocationOnMock.getArgument(0))
                .when(userService).save(any());
        AUser user = facade.changePassword(1L,
                new PasswordForm("a", "b", "c"));
    }

    @Test(expected = BadRequestException.class)
    public void whenChangePassword_EqualToOld() {
        Mockito.doReturn(createCustomer(1L, EMAIL, "", "customer", "customer", true, Fixture.createCustomerRoles())).when(userService).findById(1L);
        Mockito.doAnswer(invocationOnMock -> "d").when(passwordEncoder).encode(any());
        Mockito.doAnswer(invocationOnMock -> invocationOnMock.getArgument(0))
                .when(userService).save(any());
        AUser user = facade.changePassword(1L,
                new PasswordForm("a", "a", "a"));
    }

    @Test
    public void forgotPassword() {
        AUser customer = createCustomer(1L, EMAIL, "", "customer", "customer", true, Fixture.createCustomerRoles());
        Mockito.doReturn(customer).when(userService).findByEmail(EMAIL);
        Mockito.doReturn(createToken(1L, "ababa", customer, addHours(new Date(), 2))).when(tokenService)
                .createOrChangeVerificationToken(customer);
        facade.forgotPassword(EMAIL);
        Mockito.verify(mailService).sendSimpleMail(any(String.class), any(String.class), any(String.class));
    }

    @Test(expected = NotFoundException.class)
    public void whenForgotPassword_NotFoundException() {
        Mockito.doReturn(null).when(userService).findByEmail(EMAIL);
        facade.forgotPassword(EMAIL);
        Mockito.verify(mailService).sendSimpleMail(any(String.class), any(String.class), any(String.class));
    }

    @Test(expected = BadRequestException.class)
    public void whenForgotPassword_BadRequestException() {
        AUser customer = createCustomer(1L, EMAIL, "", "customer", "customer", false, Fixture.createCustomerRoles());
        Mockito.doReturn(customer).when(userService).findByEmail(EMAIL);
        Mockito.doReturn(createToken(1L, "ababa", customer, addHours(new Date(), 2))).when(tokenService)
                .createOrChangeVerificationToken(customer);
        facade.forgotPassword(EMAIL);
    }

    @Test
    public void getUserFromVerificationToken() {
        VerificationToken token = createToken(1L, "ababa", createCustomer(1L, EMAIL, "", "customer", "customer", true, Fixture.createCustomerRoles()), addHours(new Date(), 2));
        Mockito.doReturn(token).when(tokenService).findByToken("ababa");
        AUser user = facade.getUserFromVerificationToken(token.getToken());
        assertThat(user).isEqualTo(createCustomer(1L, EMAIL, "", "customer", "customer", true, Fixture.createCustomerRoles()));
    }

    @Test(expected = UnAuthorizedException.class)
    public void whenGetUserFromVerificationToken_Exception() {
        AUser customer = createCustomer(1L, EMAIL, "", "customer", "customer", true, createCustomerRoles());
        VerificationToken token = createToken(1L, "ababa", customer, addHours(new Date(), -2));
        Mockito.doReturn(token).when(tokenService).findByToken("ababa");
        facade.getUserFromVerificationToken(token.getToken());
    }

    @Test
    public void confirmRegistration() {
        Mockito.doReturn(createCustomer(1L, EMAIL, null, "customer", "customer", true, Fixture.createCustomerRoles())).when(userService).findByEmail(EMAIL);
        Mockito.doAnswer(invocationOnMock -> invocationOnMock.getArgument(0))
                .when(userService).save(any());
        AUser user = facade.confirmRegistration(EMAIL, "a");
        assertThat(user).isEqualTo(createCustomer(1L, EMAIL, null, "customer", "customer", true, Fixture.createCustomerRoles()));
    }

    @Test
    public void resendAnonymousToken() {
        AUser customer = createCustomer(1L, EMAIL, "", "customer", "customer", true, Fixture.createCustomerRoles());
        customer.setVerified(false);
        Mockito.doReturn(customer).when(userService).findById(1L);
        Mockito.when(tokenService.createOrChangeVerificationToken(customer))
                .thenAnswer(invocationOnMock -> createToken(1L, "ababa", invocationOnMock.getArgument(0), addHours(new Date(), 2)));
        AUser user = facade.resendAnonymousToken(1L);
        assertThat(user).isEqualTo(customer);
    }

    @Test(expected = BadRequestException.class)
    public void resendAnonymousToken_BadRequestException() {
        AUser customer = createCustomer(1L, EMAIL, "", "customer", "customer", true, Fixture.createCustomerRoles());
        Mockito.doReturn(customer).when(userService).findById(1L);
        Mockito.when(tokenService.createOrChangeVerificationToken(customer))
                .thenAnswer(invocationOnMock -> createToken(1L, "ababa", invocationOnMock.getArgument(0), addHours(new Date(), 2)));
        AUser user = facade.resendAnonymousToken(1L);
    }

    @Test
    public void resendExpiredToken() {
        AUser customer = createCustomer(1L, EMAIL, "", "customer", "customer", true, Fixture.createCustomerRoles());
        Mockito.doReturn(createToken(1L, "ababa", customer, addHours(new Date(), 2))).when(tokenService).findByToken("ababa");
        AUser user = facade.resendToken("ababa");
        assertThat(user).isEqualTo(createCustomer(1L, EMAIL, "", "customer", "customer", true, Fixture.createCustomerRoles()));
    }

    @TestConfiguration
    static class AuthenticationFacadeTestContextConfiguration {

        @Bean
        public AuthenticationFacade facade() {
            return new AuthenticationFacade();
        }
    }
}
