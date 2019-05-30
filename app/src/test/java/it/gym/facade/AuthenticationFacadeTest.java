package it.gym.facade;

import it.gym.exception.InvalidSaleException;
import it.gym.exception.SalesIsNotCompletedException;
import it.gym.facade.AuthenticationFacade;
import it.gym.model.*;
import it.gym.repository.SaleRepository;
import it.gym.service.GymService;
import it.gym.service.MailService;
import it.gym.service.UserAuthService;
import it.gym.service.UserService;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Collections;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

@RunWith(SpringRunner.class)
public class AuthenticationFacadeTest {

    @MockBean private UserService userService;
    @MockBean private GymService gymService;
    @MockBean private MailService mailService;
    @MockBean private UserAuthService authService;


    @TestConfiguration
    static class SaleServiceTestContextConfiguration {

        @Bean
        public AuthenticationFacade facade() {
            return new AuthenticationFacade();
        }
    }

    @Autowired
    private AuthenticationFacade facade;

    @Test
    public void register() {

    }
}
