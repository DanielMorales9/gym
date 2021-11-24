package it.gym.facade;

import com.fasterxml.jackson.databind.ObjectMapper;
import it.gym.mappers.UserMapper;
import it.gym.model.AUser;
import it.gym.model.Customer;
import it.gym.model.Role;
import it.gym.model.VerificationToken;
import it.gym.pojo.UserDTO;
import it.gym.repository.ImageRepository;
import it.gym.service.UserService;
import it.gym.service.VerificationTokenService;
import it.gym.utility.Fixture;
import org.hibernate.mapping.Any;
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
import java.util.List;

import static org.apache.commons.lang3.time.DateUtils.addHours;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.ArgumentMatchers.any;

@RunWith(SpringRunner.class)
public class UserFacadeTest {

  @MockBean private UserService userService;

  @MockBean
  @Qualifier("verificationTokenService")
  private VerificationTokenService tokenService;

  @MockBean private ImageRepository imageRepository;

  @MockBean private UserMapper userMapper;

  @MockBean private ObjectMapper objectMapper;

  @Autowired private UserFacade userFacade;

  @Test
  public void findUserById() {
    String email = "customer@customer.com";
    String password = "";
    String firstName = "customer";
    String lastName = "customer";
    boolean gender = true;
    boolean verified = true;
    List<Role> roles = null;

    long id = 1L;

    Customer fixture =
        Fixture.createCustomer(
            id, email, password, firstName, lastName, verified, roles, gender);
    Mockito.doReturn(fixture).when(userService).findById(id);
    Mockito.doAnswer(
            invocation -> new UserMapper().toDTO(invocation.getArgument(0)))
        .when(userMapper)
        .toDTO(any(Customer.class));
    UserDTO user = userFacade.findUserById(id);
    assertThat(user)
        .isEqualTo(
            new UserDTO(
                id, firstName, lastName, email, null, null, "C", verified,
                gender));
  }

  @Test
  public void delete() {
    AUser customer =
        Fixture.createCustomer(
            1L,
            "customer@customer.com",
            "",
            "customer",
            "customer",
            true,
            null,
            true);
    Mockito.doReturn(customer).when(userService).findById(1L);
    VerificationToken token =
        Fixture.createToken(1L, "ababa", customer, addHours(new Date(), 2));
    Mockito.doReturn(token).when(tokenService).findByUser(customer);
    Mockito.doReturn(true).when(tokenService).existsByUser(customer);

    AUser user = userFacade.delete(1L);
    Mockito.verify(tokenService).delete(token);

    assertThat(user).isEqualTo(customer);
  }

  @Test
  public void save() {
    AUser customer =
        Fixture.createCustomer(
            1L,
            "customer@customer.com",
            "",
            "customer",
            "customer",
            true,
            null,
            true);
    Mockito.doAnswer(invocationOnMock -> invocationOnMock.getArgument(0))
        .when(userService)
        .save(customer);
    AUser user = userFacade.save(customer);
    assertThat(user).isEqualTo(customer);
  }

  @Test
  public void findByEmail() {
    AUser customer =
        Fixture.createCustomer(
            1L,
            "customer@customer.com",
            "",
            "customer",
            "customer",
            true,
            null,
            true);
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
