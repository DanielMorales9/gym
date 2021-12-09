package it.gym.facade;

import static org.apache.commons.lang3.time.DateUtils.addHours;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import com.fasterxml.jackson.databind.ObjectMapper;
import it.gym.dto.UserDTO;
import it.gym.mappers.UserMapper;
import it.gym.model.AUser;
import it.gym.model.Customer;
import it.gym.model.Role;
import it.gym.model.VerificationToken;
import it.gym.repository.ImageRepository;
import it.gym.service.UserService;
import it.gym.service.VerificationTokenService;
import it.gym.utility.Fixture;
import java.util.Date;
import java.util.List;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
public class UserFacadeTest {

  @MockBean private UserService userService;

  @MockBean
  @Qualifier("verificationTokenService")
  private VerificationTokenService tokenService;

  @MockBean private ImageRepository imageRepository;

  @MockBean private ObjectMapper objectMapper;

  @TestConfiguration
  static class UserFacadeTestContextConfiguration {

    @Bean
    public UserMapper userMapper() {
      return new UserMapper();
    }

    @Bean
    public UserFacade userFacade() {
      return new UserFacade();
    }
  }

  @Autowired private UserMapper userMapper;

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
    UserDTO user = userFacade.findUserById(id);
    assertThat(user)
        .isEqualTo(
            new UserDTO(
                id, firstName, lastName, email, null, null, "C", verified,
                gender, null));
  }

  @Test
  public void delete() {
    long id = 1L;
    String email = "customer@customer.com";
    String password = "";
    String firstName = "customer";
    String lastName = "customer";
    boolean verified = true;
    List<Role> roles = null;
    boolean gender = true;
    AUser customer =
        Fixture.createCustomer(
            id, email, password, firstName, lastName, verified, roles, gender);
    Mockito.doReturn(customer).when(userService).findById(id);
    VerificationToken token =
        Fixture.createToken(id, "ababa", customer, addHours(new Date(), 2));
    Mockito.doReturn(token).when(tokenService).findByUser(customer);
    Mockito.doReturn(true).when(tokenService).existsByUser(customer);

    UserDTO user = userFacade.deleteUserById(id);
    Mockito.verify(tokenService).delete(token);

    assertThat(user)
        .isEqualTo(
            new UserDTO(
                id, firstName, lastName, email, null, null, "C", verified,
                gender, null));
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
    long id = 1L;
    String email = "customer@customer.com";
    String firstName = "customer";
    String lastName = "customer";
    boolean verified = true;
    boolean gender = true;
    AUser customer =
        Fixture.createCustomer(
            id, email, "", firstName, lastName, verified, null, gender);
    Mockito.doReturn(customer).when(userService).findByEmail(email);
    UserDTO user = userFacade.findByEmail(email);
    assertThat(user)
        .isEqualTo(
            new UserDTO(
                id, firstName, lastName, email, null, null, "C", verified,
                verified, null));
  }
}
