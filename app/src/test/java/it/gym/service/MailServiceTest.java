package it.gym.service;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.context.junit4.SpringRunner;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;

@RunWith(SpringRunner.class)
public class MailServiceTest {

    @MockBean @Qualifier("mailSender")
    private JavaMailSender mailSender;

    @TestConfiguration
    static class MailServiceTestContextConfiguration {

        @Bean
        public MailService service() {
            return new MailService();
        }
    }

    @Autowired
    private MailService service;

    @Test
    public void sendSimpleMessage() {
        service.sendSimpleMail("admin@admin.com", "MyMessage", "Message");
        Mockito.verify(mailSender).send(any(SimpleMailMessage.class));
    }
}
