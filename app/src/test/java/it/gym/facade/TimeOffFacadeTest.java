package it.gym.facade;

import it.gym.exception.InvalidReservationException;
import it.gym.exception.InvalidTimeException;
import it.gym.model.*;
import it.gym.service.*;
import org.apache.commons.lang3.time.DateUtils;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.test.context.junit4.SpringRunner;

import java.time.DayOfWeek;
import java.util.*;

import static org.apache.commons.lang3.time.DateUtils.addHours;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;

@RunWith(SpringRunner.class)
public class TimeOffFacadeTest {

    @TestConfiguration
    static class ReservationFacadeTestContextConfiguration {

        @Bean
        public TimeOffFacade facade() {
            return new TimeOffFacade();
        }
    }

    @Autowired TimeOffFacade facade;

    @Test
    public void test() {

    }

}
