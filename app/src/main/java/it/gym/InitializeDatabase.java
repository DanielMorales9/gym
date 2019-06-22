package it.gym;

import it.gym.model.*;
import it.gym.service.*;
import it.gym.utility.Constants;
import org.apache.commons.lang3.time.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.env.Environment;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class InitializeDatabase implements CommandLineRunner {

    private static final String DEV_ENV = "dev";
    private static final String PSSWD = "password";
    private static final String ADMIN_EMAIL = "goodfellas.personaltraining@gmail.com";

    @Autowired
    @Qualifier("roleService")
    private RoleService roleService;

    @Autowired
    private UserService userService;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private GymService gymService;

    @Autowired
    @Qualifier("trainingBundleSpecificationService")
    private TrainingBundleSpecificationService specService;

    @Autowired
    private TrainingBundleService bundleService;

    @Autowired
    private Environment env;

    @Override
    public void run(String... args) {
        Gym gym;
        String[] r = { Constants.ROLE_NAME_ADMIN, Constants.ROLE_NAME_TRAINER, Constants.ROLE_NAME_CUSTOMER };

        List<Role> roles = createAndSaveRoles(r);

        if (userService.findByEmail(ADMIN_EMAIL) == null) {
            gym = createAndSaveGym();
            createAndSaveAdmin(gym, roles);
        }
        else {
            gym = gymService.findById(1L);
        }

        if (env.getActiveProfiles()[0].equals(DEV_ENV)) {
            createAndSaveCustomer(gym, roles.subList(2, 3));
            createAndSaveTrainer(gym, roles.subList(1, 2));
            ATrainingBundleSpecification personal = createAndSavePersonalBundleSpecification();
            createAndSavePersonalBundle(personal);
            ATrainingBundleSpecification course = createAndSaveCourseBundleSpecification();
            createAndSaveCourseBundle(course);

        }
    }

    private void createAndSaveCourseBundle(ATrainingBundleSpecification course) {
        this.bundleService.save(createPersonalBundle(course));
    }

    private ATrainingBundleSpecification createAndSaveCourseBundleSpecification() {
        return specService.save(createCourseBundleSpecification(new Date()));
    }

    private void createAndSavePersonalBundle(ATrainingBundleSpecification a) {
        this.bundleService.save(createPersonalBundle(a));
    }

    private ATrainingBundleSpecification createAndSavePersonalBundleSpecification() {
        return specService.save(createPersonalBundleSpecification());
    }

    private void createAndSaveTrainer(Gym gym, List<Role> roles) {
        String password = bCryptPasswordEncoder.encode(PSSWD);
        Trainer trainer = createTrainer(password, gym, roles);
        userService.save(trainer);
    }

    private void createAndSaveCustomer(Gym gym, List<Role> roles) {
        String password = bCryptPasswordEncoder.encode(PSSWD);
        Customer customer = createCustomer(password, gym, roles);
        userService.save(customer);
    }

    private void createAndSaveAdmin(Gym gym, List<Role> roles) {
        String password = bCryptPasswordEncoder.encode(PSSWD);
        Admin admin = createAdmin(password, gym, roles);
        userService.save(admin);
    }

    private Gym createAndSaveGym() {
        Gym gym = createGym();
        return gymService.save(gym);
    }


    private List<Role> createAndSaveRoles(String[] roles) {
        return Arrays.stream(roles).map(a -> {
            Role role = new Role();
            role.setName(a);
            return roleService.save(role);
        }).collect(Collectors.toList());
    }

    private ATrainingBundle createCourseBundle(Date start, ATrainingBundleSpecification spec) {
        CourseTrainingBundle p = new CourseTrainingBundle();
        p.setName("Course");
        p.setDescription("Questo è un pacchetto Corso");
        p.setExpired(false);
        p.setBundleSpec(spec);
        p.setPrice(111.0);
        Date end = DateUtils.addDays(start, 30);
        p.setStartTime(start);
        p.setEndTime(end);
        p.setMaxCustomers(11);
        return p;
    }

    private ATrainingBundleSpecification createCourseBundleSpecification(Date start) {
        CourseTrainingBundleSpecification p = new CourseTrainingBundleSpecification();
        p.setId(1L);
        p.setName("Corso");
        p.setDescription("Questo è un pacchetto Corso");
        p.setDisabled(false);
        p.setPrice(111.0);
        Date end = DateUtils.addDays(start, 30);
        p.setStartTime(start);
        p.setEndTime(end);
        p.setMaxCustomers(11);
        return p;
    }

    private ATrainingBundle createPersonalBundle(ATrainingBundleSpecification spec) {
        PersonalTrainingBundle p = new PersonalTrainingBundle();
        p.setName("Personal Training");
        p.setDescription("Questo è un pacchetto di Personal Training");
        p.setExpired(false);
        p.setBundleSpec(spec);
        p.setPrice(111.0);
        p.setNumSessions(11);
        return p;
    }

    private ATrainingBundleSpecification createPersonalBundleSpecification() {
        PersonalTrainingBundleSpecification p = new PersonalTrainingBundleSpecification();
        p.setId(1L);
        p.setName("Personal");
        p.setDescription("Questo è un pacchetto di Personal Training");
        p.setDisabled(false);
        p.setPrice(111.0);
        p.setNumSessions(11);
        return p;
    }

    private Admin createAdmin(String password, Gym gym, List<Role> roles) {
        Admin admin = new Admin();
        admin.setEmail(ADMIN_EMAIL);
        admin.setFirstName("Admin");
        admin.setLastName("Admin");
        admin.setPassword(password);
        admin.setVerified(true);
        admin.setRoles(roles);
        admin.setGym(gym);
        return admin;
    }

    private Customer createCustomer(String password, Gym gym, List<Role> roles) {
        Customer customer = new Customer();
        customer.setEmail("dnlmrls9@gmail.com");
        customer.setFirstName("Daniel");
        customer.setLastName("Morales");
        customer.setPassword(password);
        customer.setVerified(true);
        customer.setRoles(roles);
        customer.setGym(gym);
        return customer;
    }

    private Trainer createTrainer(String password, Gym gym, List<Role> roles) {
        Trainer trainer = new Trainer();
        trainer.setEmail("dan.morales@stud.uniroma3.it");
        trainer.setFirstName("Lorenzo");
        trainer.setLastName("Lunari");
        trainer.setPassword(password);
        trainer.setVerified(true);
        trainer.setRoles(roles);
        trainer.setGym(gym);
        return trainer;
    }

    private Gym createGym() {
        Gym gym = new Gym();
        gym.setName("Goodfellas");
        gym.setMondayStartHour(8);
        gym.setMondayEndHour(22);
        gym.setMondayOpen(true);
        gym.setTuesdayStartHour(8);
        gym.setTuesdayEndHour(22);
        gym.setTuesdayOpen(true);
        gym.setWednesdayStartHour(8);
        gym.setWednesdayEndHour(22);
        gym.setWednesdayOpen(true);
        gym.setThursdayStartHour(8);
        gym.setThursdayEndHour(22);
        gym.setThursdayOpen(true);
        gym.setFridayStartHour(8);
        gym.setFridayEndHour(22);
        gym.setFridayOpen(true);
        gym.setSaturdayStartHour(8);
        gym.setSaturdayEndHour(22);
        gym.setSaturdayOpen(true);
        gym.setSundayStartHour(0);
        gym.setSundayEndHour(0);
        gym.setSundayOpen(false);
        gym.setWeekStartsOn(DayOfWeek.MONDAY);
        return gym;
    }
}
