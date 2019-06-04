package it.gym.service;

import it.gym.model.AUser;
import it.gym.model.Admin;
import it.gym.model.VerificationToken;
import it.gym.repository.VerificationTokenRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Date;
import java.util.Optional;

import static org.apache.commons.lang3.time.DateUtils.addHours;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;

@RunWith(SpringRunner.class)
public class VerificationTokenServiceTest {

    @MockBean private VerificationTokenRepository repository;

    @TestConfiguration
    static class VerificationTestContextConfiguration {

        @Bean
        public VerificationTokenService service() {
            return new VerificationTokenService();
        }
    }

    @Autowired
    private VerificationTokenService service;

    @Test
    public void save() {
        this.service.save(createToken(createUser()));
        Mockito.verify(repository).save(any(VerificationToken.class));
    }

    @Test
    public void findById() {
        Mockito.when(repository.findById(1L)).thenAnswer(invocationOnMock -> Optional.of(createToken(createUser())));
        VerificationToken vk = this.service.findById(1L);
        assertThat(vk).isEqualTo(createToken(createUser()));
        Mockito.verify(repository).findById(anyLong());
    }

    @Test
    public void findByToken() {
        Mockito.when(repository.findByToken("ababa")).thenAnswer(invocationOnMock -> Optional.of(createToken(createUser())));
        VerificationToken vk = this.service.findByToken("ababa");
        assertThat(vk).isEqualTo(createToken(createUser()));
        Mockito.verify(repository).findByToken(anyString());
    }


    @Test
    public void findByUser() {
        Mockito.when(repository.findByUser(createUser())).thenAnswer(invocationOnMock -> Optional.of(createToken(createUser())));
        VerificationToken vk = this.service.findByUser(createUser());
        assertThat(vk).isEqualTo(createToken(createUser()));
        Mockito.verify(repository).findByUser(any(AUser.class));
    }

    @Test
    public void createOrChangeVerificationToken() {
        VerificationToken vk = this.service.createOrChangeVerificationToken(createUser());
        Mockito.verify(repository).findByUser(any(AUser.class));
    }
    @Test
    public void invalidateToken() {
        VerificationToken token = createToken(createUser());
        service.invalidateToken(token);
        assertThat(token.isExpired()).isTrue();
    }
    private VerificationToken createToken(AUser u) {
        VerificationToken vk = new VerificationToken();
        vk.setId(1L);
        vk.setToken("ababa");
        vk.setExpiryDate(addHours(new Date(), 2));
        vk.setUser(u);
        return vk;
    }

    private AUser createUser() {
        AUser u = new Admin();
        u.setId(1L);
        u.setEmail("admin@admin.com");
        u.setFirstName("admin");
        u.setLastName("admin");
        return u;
    }

}
