package it.gym.facade;

import it.gym.exception.InternalServerException;
import it.gym.model.*;
import it.gym.pojo.PasswordForm;
import it.gym.service.*;
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

import java.time.DayOfWeek;
import java.util.Collections;
import java.util.Date;
import java.util.List;

import static org.apache.commons.lang3.time.DateUtils.addHours;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;

@RunWith(SpringRunner.class)
public class AuthenticationFacadeTest {

    @MockBean private UserService userService;
    @MockBean private GymService gymService;
    @MockBean private MailService mailService;
    private static final String EMAIL = "admin@admin.com";
    @MockBean
    private BCryptPasswordEncoder passwordEncoder;
    @MockBean
    private RoleService roleService;
    @MockBean
    @Qualifier("verificationTokenService")
    private VerificationTokenService tokenService;
    @MockBean
    private PasswordValidationService passwordValidationService;
    @Autowired
    private AuthenticationFacade facade;

    @Test
    public void register() {
        // could be made simpler
        Mockito.when(gymService.findById(1L)).thenReturn(createGym());
        Mockito.when(roleService.findAllById(Collections.singletonList(3L))).thenReturn(createCustomerRole());
        Mockito.doAnswer(invocationOnMock -> invocationOnMock.getArgument(0)).when(userService).save(any(AUser.class));
        Mockito.when(tokenService.createOrChangeVerificationToken(any(AUser.class)))
                .thenAnswer(invocationOnMock -> createToken(invocationOnMock.getArgument(0)));
        AUser user = facade.register(createCustomer(), 1L);

        Mockito.verify(userService).existsByEmail("admin@admin.com");
        Mockito.verify(userService).save(user);
        Mockito.verify(mailService).sendSimpleMail(any(String.class), any(String.class), any(String.class));

        Gym gym = user.getGym();
        List<Role> roles = user.getRoles();

        assertThat(roles).isEqualTo(createCustomerRole());
        assertThat(gym).isEqualTo(createGym());
    }

    @Test(expected = InternalServerException.class)
    public void whenRegisteringThrowsException() {
        Mockito.when(gymService.findById(1L)).thenReturn(createGym());
        Mockito.when(roleService.findAllById(Collections.singletonList(3L))).thenReturn(createCustomerRole());
        Mockito.when(userService.existsByEmail("admin@admin.com")).thenReturn(true);
        facade.register(createCustomer(), 1L);
    }

    @Test
    public void changePassword() {
        Mockito.doReturn(createCustomer()).when(userService).findById(1L);
        Mockito.doAnswer(invocationOnMock -> "c").when(passwordEncoder).encode(any());
        Mockito.doAnswer(invocationOnMock -> invocationOnMock.getArgument(0))
                .when(userService).save(any());
        AUser user = facade.changePassword(1L,
                new PasswordForm("a", "b", "b"));
        assertThat(user.getPassword()).isEqualTo("c");
    }

    @Test
    public void forgotPassword() {
        AUser customer = createCustomer();
        Mockito.doReturn(customer).when(userService).findByEmail(EMAIL);
        Mockito.doReturn(createToken(customer)).when(tokenService)
                .createOrChangeVerificationToken(customer);
        facade.forgotPassword(EMAIL);
        Mockito.verify(mailService).sendSimpleMail(any(String.class), any(String.class), any(String.class));
    }

    @Test
    public void getUserFromVerificationToken() {
        VerificationToken token = createToken(createCustomer());
        Mockito.doReturn(token).when(tokenService).findByToken("ababa");
        AUser user = facade.getUserFromVerificationToken(token.getToken());
        assertThat(user).isEqualTo(createCustomer());
    }

    @Test
    public void confirmRegistration() {
        Mockito.doReturn(createCustomer()).when(userService).findByEmail(EMAIL);
        Mockito.doAnswer(invocationOnMock -> invocationOnMock.getArgument(0))
                .when(userService).save(any());
        AUser user = facade.confirmRegistration(EMAIL, "a");
        assertThat(user).isEqualTo(createCustomer());
    }

    @Test
    public void resendAnonymousToken() {
        AUser customer = createCustomer();
        customer.setVerified(false);
        Mockito.doReturn(customer).when(userService).findById(1L);
        Mockito.when(tokenService.createOrChangeVerificationToken(customer))
                .thenAnswer(invocationOnMock -> createToken(invocationOnMock.getArgument(0)));
        AUser user = facade.resendAnonymousToken(1L);
        assertThat(user).isEqualTo(customer);
    }

    @Test
    public void resendExpiredToken() {
        AUser customer = createCustomer();
        Mockito.doReturn(createToken(customer)).when(tokenService).findByToken("ababa");
        AUser user = facade.resendToken("ababa");
        assertThat(user).isEqualTo(createCustomer());
    }

    private VerificationToken createToken(AUser u) {
        VerificationToken vk = new VerificationToken();
        vk.setId(1L);
        vk.setToken("ababa");
        vk.setExpiryDate(addHours(new Date(), 2));
        vk.setUser(u);
        return vk;
    }

    private List<Role> createCustomerRole() {
        Role role = new Role();
        role.setName("CUSTOMER");
        role.setId(3L);
        return Collections.singletonList(role);
    }

    private AUser createCustomer() {
        AUser user = new Customer();
        user.setId(1L);
        user.setEmail("admin@admin.com");
        user.setFirstName("admin");
        user.setLastName("admin");
        user.setVerified(true);
        user.setRoles(createCustomerRole());
        return user;
    }

    private Gym createGym() {
        Gym gym = new Gym();
        gym.setId(1L);
        gym.setWeekStartsOn(DayOfWeek.MONDAY);
        gym.setMondayOpen(true);
        gym.setTuesdayOpen(false);
        gym.setWednesdayOpen(false);
        gym.setThursdayOpen(false);
        gym.setFridayOpen(false);
        gym.setSaturdayOpen(false);
        gym.setSundayOpen(false);
        return gym;
    }

    @TestConfiguration
    static class AuthenticationFacadeTestContextConfiguration {

        @Bean
        public AuthenticationFacade facade() {
            return new AuthenticationFacade();
        }
    }
}
