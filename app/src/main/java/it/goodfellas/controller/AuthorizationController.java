package it.goodfellas.controller;

import it.goodfellas.exception.InvalidTokenException;
import it.goodfellas.exception.POJONotFoundException;
import it.goodfellas.hateoas.*;
import it.goodfellas.model.*;
import it.goodfellas.repository.RoleRepository;
import it.goodfellas.repository.UserRepository;
import it.goodfellas.repository.VerificationTokenRepository;
import it.goodfellas.service.IUserAuthService;
import it.goodfellas.utility.PasswordGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Calendar;
import java.util.UUID;

@RestController
@PropertySource("application.yml")
@RequestMapping("/authentication")
public class AuthorizationController {
    private final static Logger logger = LoggerFactory.getLogger(AuthorizationController.class);

    private IUserAuthService userService;
    private final UserRepository userRepository;
    private final JavaMailSender mailSender;
    private final RoleRepository roleRepository;
    private final VerificationTokenRepository tokenRepository;

    private final PasswordEncoder passwordEncoder;

    @Value("${baseUrl}")
    private String baseUrl;

    @Autowired
    public AuthorizationController(UserRepository userRepository,
                                   JavaMailSender mailSender,
                                   VerificationTokenRepository tokenRepository,
                                   RoleRepository roleRepository,
                                   PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.mailSender = mailSender;
        this.tokenRepository = tokenRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }


    @Autowired
    @Qualifier("userAuthService")
    public void setUserService(IUserAuthService userService) {
        this.userService = userService;
    }


    @PostMapping(path = "/customer/registration")
    ResponseEntity<CustomerResource> customerRegistration(@Valid @RequestBody Customer input) {
        logger.info("Customer is trying to register: " + input.toString());

        AUser c = registerUser(input);
        ResponseEntity<CustomerResource> response;
        if (c != null)
            response = new ResponseEntity<>(
                    new CustomerAssembler().toResource((Customer) c), HttpStatus.OK);
        else
            response = ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        return response;
    }

    @PostMapping(path = "/trainer/registration")
    ResponseEntity<TrainerResource> trainerRegistration(@Valid @RequestBody Trainer input) {
        logger.info("Trainer is trying to register: " + input.toString());

        AUser c = registerUser(input);
        ResponseEntity<TrainerResource> response;
        if (c != null)
            response = new ResponseEntity<>(
                    new TrainerAssembler().toResource((Trainer) c), HttpStatus.OK);
        else
            response = ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        return response;
    }


    @PostMapping(path = "/admin/registration")
    ResponseEntity<AdminResource> adminRegistration(@Valid @RequestBody Admin input) {
        logger.info("Admin is trying to register: " + input.toString());

        AUser c = registerUser(input);
        ResponseEntity<AdminResource> response;
        if (c != null)
            response = new ResponseEntity<>(
                    new AdminAssembler().toResource((Admin) c), HttpStatus.OK);
        else
            response = ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        return response;
    }

    @PostMapping("/customer/verifyPassword")
    ResponseEntity<CustomerResource> changeCustomerPassword(@RequestBody Customer user) {
        logger.info(user.toString());
        user = (Customer) userService.changePassword(user.getEmail(), user.getPassword());
        return new ResponseEntity<>(new CustomerAssembler().toResource(user), HttpStatus.OK);
    }

    @PostMapping("/admin/verifyPassword")
    ResponseEntity<AdminResource> changeAdminPassword(@RequestBody Admin user) {
        user = (Admin) userService.changePassword(user.getEmail(), user.getPassword());
        return new ResponseEntity<>(new AdminAssembler().toResource(user), HttpStatus.OK);
    }

    @PostMapping("/trainer/verifyPassword")
    ResponseEntity<TrainerResource> changeTrainerPassword(@RequestBody Trainer user) {
        user = (Trainer) userService.changePassword(user.getEmail(), user.getPassword());
        return new ResponseEntity<>(new TrainerAssembler().toResource(user), HttpStatus.OK);
    }

    @PostMapping("/customer/changePassword")
    ResponseEntity<AUserResource> modifyCustomerPassword(@RequestBody Customer user) {
        logger.info("About to change password for customer");
        AUser u = userService.changePassword(user.getEmail(), user.getPassword());
        return new ResponseEntity<>(new AUserAssembler().toResource(u), HttpStatus.OK);
    }

    @PostMapping("/trainer/changePassword")
    ResponseEntity<AUserResource> modifyTrainerPassword(@RequestBody Trainer user) {
        logger.info("About to change password for trainer");
        AUser u = userService.changePassword(user.getEmail(), user.getPassword());
        return new ResponseEntity<>(new AUserAssembler().toResource(u), HttpStatus.OK);
    }

    @PostMapping("/admin/changePassword")
    ResponseEntity<AUserResource> modifyAdminPassword(@RequestBody Admin user) {
        logger.info("About to change password for admin");
        AUser u = userService.changePassword(user.getEmail(), user.getPassword());
        return new ResponseEntity<>(new AUserAssembler().toResource(u), HttpStatus.OK);
    }

    @PostMapping("/changeNewPassword/{id}")
    ResponseEntity<AUserResource> changeNewPassword(@PathVariable("id") Long id,
                                                    @RequestBody PasswordForm form) {
        AUser user = this.userRepository.findById(id)
                .orElseThrow(() -> new POJONotFoundException("User", id));
        logger.info(form.toString());

        String newPwd = passwordEncoder.encode(form.getPassword());
        logger.info(passwordEncoder.matches(form.getOldPassword(), user.getPassword()) ?
                "password coincidono": "password non coincidono");
        if (passwordEncoder.matches(form.getOldPassword(), user.getPassword())
                && form.getConfirmPassword().equals(form.getPassword())) {
            user.setPassword(newPwd);
            user.setConfirmPassword(newPwd);
            user = this.userRepository.save(user);
            return new ResponseEntity<>(new AUserAssembler().toResource(user), HttpStatus.OK);
        }
        logger.info(form.getConfirmPassword().equals(form.getPassword()) ? "nuove password coincidono" : "nuove password non coincidono");
        return ResponseEntity.badRequest().body(null);
    }
    @GetMapping(path = "/verification")
    ResponseEntity<AUserResource> verify(@RequestParam String token) {
        logger.info("About to verify...");
        VerificationToken verificationToken = userService.getVerificationToken(token);
        if (verificationToken == null) {
            throw new InvalidTokenException();
        }

        AUser user = verificationToken.getUser();
        logger.info(user.toString());
        Calendar cal = Calendar.getInstance();
        if ((verificationToken.getExpiryDate().getTime() - cal.getTime().getTime()) <= 0) {
            return new ResponseEntity<>(
                    new AUserAssembler().toResource(user), HttpStatus.NOT_EXTENDED);
        }
        return new ResponseEntity<>(
                new AUserAssembler().toResource(user), HttpStatus.OK);
    }

    @GetMapping(path = "/findByEmail")
    ResponseEntity<AUserResource> findEmail(@RequestParam String email) {
        logger.info("Authentication: Find By Email");
        AUser user = userRepository.findByEmail(email);
        logger.info(user.toString());

        if (user.isVerified()) {
            String token = UUID.randomUUID().toString();
            userService.createVerificationToken(user, token);
            sendChangePasswordTokenToEmail(user, token);
            return new ResponseEntity<>(
                    new AUserAssembler().toResource(user), HttpStatus.OK);
        }
        return new ResponseEntity<>(
                new AUserAssembler().toResource(user), HttpStatus.BAD_GATEWAY);
    }

    private void sendChangePasswordTokenToEmail(AUser user, String token) {
        String recipientAddress = user.getEmail();
        String subject = "Cambia la tua password";
        String confirmationUrl
                = this.baseUrl+ "/auth/modifyPassword?token=" + token;
        String message = "Per modificare la password usa il seguente link: ";

        sendEmail(subject,message+confirmationUrl, recipientAddress);
    }

    @GetMapping(path = "/resendChangePasswordToken")
    public ResponseEntity resendChangePasswordToken(@RequestParam("token") String existingToken) {
        VerificationToken newToken = userService.generateNewVerificationToken(existingToken);
        logger.info("RESEND CHANGE PASSWORD TOKEN");
        Long userId = newToken.getUser().getId();
        AUser user = this.userRepository.findById(userId)
                .orElseThrow(() -> new POJONotFoundException("User", userId));

        sendChangePasswordTokenToEmail(user, newToken.getToken());

        return new ResponseEntity<>(
                new AUserAssembler().toResource(user), HttpStatus.OK);
    }

    @GetMapping(path = "/resendToken/{id}")
    public ResponseEntity resendRegistrationToken(@PathVariable("id") Long id) {
        AUser user = this.userRepository.findById(id)
                .orElseThrow(() -> new POJONotFoundException("User", id));
        VerificationToken token = this.tokenRepository.findByUser(user);
        VerificationToken newToken = userService.generateNewVerificationToken(token.getToken());
        sendVerificationEmail(newToken, user);
        return new ResponseEntity<>(
                new AUserAssembler().toResource(user), HttpStatus.OK);
    }

    @GetMapping(path = "/resendToken/")
    public ResponseEntity resendTokenAnoymous(@RequestParam("token") String existingToken) {
        VerificationToken newToken = userService.generateNewVerificationToken(existingToken);
        logger.info("RESEND TOKEN");
        Long userId = newToken.getUser().getId();
        AUser user = this.userRepository.findById(userId)
                .orElseThrow(() -> new POJONotFoundException("User", userId));

        sendVerificationEmail(newToken, user);

        return new ResponseEntity<>(
                new AUserAssembler().toResource(user), HttpStatus.OK);
    }

    private void sendVerificationEmail(VerificationToken newToken, AUser user) {
        String subject = "Verifica Account";
        String recipientAddress = user.getEmail();
        String confirmationUrl
                = this.baseUrl+ "/auth/verification?token=" + newToken.getToken();
        String message = "Ti abbiamo generato un nuovo link di verifica: ";
        sendEmail(subject, message+confirmationUrl, recipientAddress);
    }

    @PutMapping(path = "/users/{userId}/roles/{roleId}")
    ResponseEntity<AUserResource> addRoleToUser(@PathVariable Long userId,
                                                @PathVariable Long roleId) {
        AUser user = this.userRepository.findById(userId)
                .orElseThrow(() -> new POJONotFoundException("User", userId));

        Role role = this.roleRepository.findById(roleId)
                .orElseThrow(() -> new POJONotFoundException("Role", roleId));

        if (!user.getRoles().contains(role)) {
            user.addRole(role);
            user = this.userRepository.save(user);
        }
        return ResponseEntity.ok(new AUserAssembler().toResource(user));
    }

    private void setRandomPassword(@Valid @RequestBody AUser input) {
        PasswordGenerator.PasswordGeneratorBuilder builder = new PasswordGenerator.PasswordGeneratorBuilder();
        builder.useDigits(true);
        builder.useLower(true);
        builder.usePunctuation(true);
        builder.useUpper(true);
        PasswordGenerator gen = builder.build();

        String password = gen.generate(30);
        logger.info(password);
        input.setPassword(password);
    }

    private void sendEmail(String subject,
                           String message,
                           String recipientAddress) {
        SimpleMailMessage email = new SimpleMailMessage();
        email.setTo(recipientAddress);
        email.setSubject(subject);
        email.setText(message);
        mailSender.send(email);
    }

    private AUser registerUser(@RequestBody @Valid AUser input) {
        setRandomPassword(input);

        return userService.register(input);
    }


}
