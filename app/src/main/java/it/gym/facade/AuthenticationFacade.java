package it.gym.facade;

import it.gym.config.CustomProperties;
import it.gym.exception.BadRequestException;
import it.gym.exception.InternalServerException;
import it.gym.exception.NotFoundException;
import it.gym.exception.UnAuthorizedException;
import it.gym.model.AUser;
import it.gym.model.Role;
import it.gym.model.VerificationToken;
import it.gym.pojo.PasswordForm;
import it.gym.service.*;
import it.gym.utility.PasswordGenerator;
import java.util.List;
import java.util.stream.Collectors;
import javax.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.mail.MailException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Transactional
public class AuthenticationFacade {
  private static final Logger logger =
      LoggerFactory.getLogger(AuthenticationFacade.class);

  private static final String EMAIL_REGISTRATION_EX_MESSAGE =
      "Non è stato possibile inviare l'email a %s %s";

  @Autowired
  @Qualifier("mailService")
  private MailService mailService;

  @Autowired private PasswordValidationService passwordValidationService;

  @Autowired private RoleService roleService;

  @Autowired
  @Qualifier("verificationTokenService")
  private VerificationTokenService tokenService;

  @Autowired private PasswordEncoder passwordEncoder;

  @Autowired private UserService userService;

  @Autowired CustomProperties properties;

  public AUser register(AUser user) {
    logger.info(String.format("User is being registered: %s", user.toString()));

    logger.info("Registering user");
    String password = generateRandomPassword();

    List<Long> rolesId =
        user.defaultRoles().stream()
            .map(Role::getId)
            .collect(Collectors.toList());

    List<Role> roles = roleService.findAllById(rolesId);
    user.setPassword(passwordEncoder.encode(password));
    user.setRoles(roles);
    user.setVerified(false);

    if (userService.existsByEmail(user.getEmail()))
      throw new InternalServerException(
          String.format(
              "L'utente con l'email %s esiste già.", user.getEmail()));
    else user = this.userService.save(user);

    VerificationToken vk = tokenService.createOrChangeVerificationToken(user);

    try {
      this.sendRegistrationConfirmationEmail(vk);
    } catch (MailException e) {
      logger.error(e.getMessage());
      this.rollbackRegistration(vk);

      String message =
          String.format(
              EMAIL_REGISTRATION_EX_MESSAGE,
              user.getFirstName(),
              user.getLastName());
      throw new InternalServerException(message);
    }

    return user;
  }

  public AUser confirmRegistration(String email, String password) {
    passwordValidationService.validate(password);

    AUser user = this.userService.findByEmail(email);

    setPasswordToUser(user, password);
    invalidateTokenToUser(user);

    return userService.save(user);
  }

  public AUser changePassword(Long id, PasswordForm form) {
    confirmPassword(form.getPassword(), form.getConfirmPassword());
    confirmPasswordNotEqualToOld(form.getPassword(), form.getOldPassword());
    passwordValidationService.validate(form.getPassword());

    AUser user = this.userService.findById(id);

    setPasswordToUser(user, form.getPassword());
    invalidateTokenToUser(user);

    return userService.save(user);
  }

  public AUser forgotPassword(String email) {
    logger.info(String.format("Authentication: Find By Email: %s", email));
    AUser user = userService.findByEmail(email);
    if (user == null)
      throw new NotFoundException(
          String.format("L'utente con email %s non è stato trovato.", email));

    if (!user.isVerified())
      throw new BadRequestException(
          "L'utente con email " + email + " non è stato verificato!");

    VerificationToken vk =
        this.tokenService.createOrChangeVerificationToken(user);
    sendChangePasswordTokenToEmail(vk);
    return user;
  }

  public AUser getUserFromVerificationToken(String token) {
    VerificationToken vToken = tokenService.findByToken(token);
    logger.info(vToken.toString());
    if (vToken.isExpired()) {
      throw new UnAuthorizedException("Il token è scaduto.");
    }
    logger.info(vToken.getUser().toString());
    return vToken.getUser();
  }

  public AUser resendAnonymousToken(Long id) {
    AUser user = this.userService.findById(id);
    if (user.isVerified())
      throw new BadRequestException(
          "L'utente con email " + user.getEmail() + " è già stato verificato!");

    VerificationToken vk =
        this.tokenService.createOrChangeVerificationToken(user);
    sendVerificationEmail(vk);
    return user;
  }

  public AUser resendToken(String existingToken) {
    VerificationToken vk = this.tokenService.findByToken(existingToken);
    AUser user = vk.getUser();
    this.tokenService.createOrChangeVerificationToken(user);

    sendVerificationEmail(vk);
    return user;
  }

  private void rollbackRegistration(VerificationToken vk) {
    tokenService.delete(vk);
    userService.deleteById(vk.getUser().getId());
  }

  private String generateRandomPassword() {
    PasswordGenerator.PasswordGeneratorBuilder builder =
        new PasswordGenerator.PasswordGeneratorBuilder();
    builder.useDigits(true);
    builder.useLower(true);
    builder.usePunctuation(true);
    builder.useUpper(true);
    PasswordGenerator gen = builder.build();
    return gen.generate(30);
  }

  private void invalidateTokenToUser(AUser user) {
    VerificationToken token = tokenService.findByUser(user);
    this.tokenService.invalidateToken(token);
  }

  private void setPasswordToUser(AUser user, String password) {
    String encodedPassword = passwordEncoder.encode(password);
    user.setPassword(encodedPassword);
    user.setVerified(true);
  }

  private void confirmPassword(String password, String confirmPassword) {
    if (!confirmPassword.equals(password))
      throw new BadRequestException("Le password non coincidono");
  }

  private void confirmPasswordNotEqualToOld(
      String password, String oldPassword) {
    if (oldPassword.equals(password))
      throw new BadRequestException(
          "Nuova password coincide con la precedente");
  }

  private void sendRegistrationConfirmationEmail(VerificationToken token) {
    String recipientAddress = token.getUser().getEmail();
    String subject = "Conferma la registrazione";
    String confirmationUrl =
        String.format(
            "%s/auth/verification?token=%s",
            properties.getBaseURL(), token.getToken());
    String message =
        String.format(
            "Per registrare autenticati al seguente indirizzo: %s",
            confirmationUrl);
    this.mailService.sendSimpleMail(recipientAddress, subject, message);
  }

  private void sendChangePasswordTokenToEmail(VerificationToken token) {
    String recipientAddress = token.getUser().getEmail();
    String subject = "Cambia la tua password";
    String confirmationUrl =
        String.format(
            "%s/auth/modifyPassword?token=%s",
            properties.getBaseURL(), token.getToken());
    String message =
        String.format(
            "Per modificare la password usa il seguente link: %s",
            confirmationUrl);
    this.mailService.sendSimpleMail(recipientAddress, subject, message);
  }

  private void sendVerificationEmail(VerificationToken token) {
    String subject = "Verifica Account";
    String recipientAddress = token.getUser().getEmail();
    String confirmationUrl =
        String.format(
            "%s/auth/verification?token=%s",
            properties.getBaseURL(), token.getToken());
    String message =
        String.format(
            "Ti abbiamo generato un nuovo link di verifica: %s",
            confirmationUrl);
    this.mailService.sendSimpleMail(recipientAddress, subject, message);
  }
}
