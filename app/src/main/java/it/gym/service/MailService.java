package it.gym.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    @Autowired @Qualifier("mailSender") private JavaMailSender mailSender;

    public void sendSimpleMail(String recipientAddress, String subject, String confirmationUrl, String message) {
        SimpleMailMessage email = new SimpleMailMessage();
        email.setTo(recipientAddress);
        email.setSubject(subject);
        email.setText(message + confirmationUrl);
        mailSender.send(email);
    }
}
