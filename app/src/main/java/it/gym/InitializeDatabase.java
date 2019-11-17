package it.gym;

import it.gym.config.TenantContext;
import it.gym.facade.TrainingBundleSpecificationFacade;
import it.gym.model.*;
import it.gym.service.*;
import org.apache.commons.lang3.time.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
import java.util.Date;
import java.util.List;

@Component
@PropertySource("application.yml")
public class InitializeDatabase implements CommandLineRunner {

    private static final String DEV_ENV = "dev";

    @Value("${admin_email}")
    String ADMIN_EMAIL;

    @Value("${admin_password}")
    String ADMIN_PASSWORD;

    @Value("${schema}")
    String SCHEMA;

    @Autowired
    @Qualifier("roleService")
    private RoleService roleService;

    @Autowired
    private TenantService tenantService;

    @Autowired
    private UserService userService;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private GymService gymService;

    @Autowired
    private TrainingBundleSpecificationFacade specService;

    @Autowired
    private Environment env;

    @Override
    public void run(String... args) {

        Tenant tenant = createTenant();
        boolean exists = tenantService.existsByTenant(tenant);
        if (exists) {
            tenant = tenantService.findTenantBySchemaName(tenant.getSchemaName());
        }
        else {
            tenant = tenantService.createTenant(tenant);
        }

        if (isDev()) {
            // setting Current Tenant Schema for multi-tenant access
            TenantContext.setCurrentTenantSchema(tenant.getSchemaName());

            List<Role> roles = retrieveRoles();

            Gym gym;
            if (userService.findByEmail(ADMIN_EMAIL) == null) {
                gym = createAndSaveGym();
                createAndSaveAdmin(gym, roles);
            }
            else {
                gym = gymService.findById(1L);
            }

            createAndSaveCustomer(gym, roles.subList(2, 3));
            createAndSaveTrainer(gym, roles.subList(1, 2));
            createAndSavePersonalBundleSpecification();
            createAndSaveCourseBundleSpecification();
        }
    }



    private boolean isDev() {
        return env.getActiveProfiles()[0].equals(DEV_ENV);
    }

    private Tenant createTenant() {
        Tenant tenant = new Tenant();
        tenant.setSchemaName(SCHEMA);
        tenant.setTenantName(SCHEMA);
        return tenant;
    }

    private void createAndSaveCourseBundleSpecification() {
        specService.createTrainingBundleSpecification(createCourseBundleSpecification(new Date()));
    }

    private void createAndSavePersonalBundleSpecification() {
        specService.createTrainingBundleSpecification(createPersonalBundleSpecification());
    }

    private void createAndSaveTrainer(Gym gym, List<Role> roles) {
        String password = bCryptPasswordEncoder.encode(ADMIN_PASSWORD);
        Trainer trainer = createTrainer(password, gym, roles);
        if (!userService.existsByEmail(trainer.getEmail())) userService.save(trainer);
    }

    private void createAndSaveCustomer(Gym gym, List<Role> roles) {
        String password = bCryptPasswordEncoder.encode(ADMIN_PASSWORD);
        Customer customer = createCustomer(password, gym, roles);
        if (!userService.existsByEmail(customer.getEmail())) userService.save(customer);
    }

    private void createAndSaveAdmin(Gym gym, List<Role> roles) {
        String password = bCryptPasswordEncoder.encode(ADMIN_PASSWORD);
        Admin admin = createAdmin(password, gym, roles);
        if (!userService.existsByEmail(admin.getEmail())) userService.save(admin);
    }

    private Gym createAndSaveGym() {
        Gym gym = createGym();
        return gymService.save(gym);
    }


    private List<Role> retrieveRoles() {
        return roleService.findAll();
    }

    private ATrainingBundleSpecification createCourseBundleSpecification(Date start) {
        CourseTrainingBundleSpecification p = new CourseTrainingBundleSpecification();
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

    private ATrainingBundleSpecification createPersonalBundleSpecification() {
        PersonalTrainingBundleSpecification p = new PersonalTrainingBundleSpecification();
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
        customer.setEmail("pippo@email.com");
        customer.setFirstName("Pippo");
        customer.setLastName("Pippo");
        customer.setPassword(password);
        customer.setVerified(true);
        customer.setRoles(roles);
        customer.setGym(gym);
        return customer;
    }

    private Trainer createTrainer(String password, Gym gym, List<Role> roles) {
        Trainer trainer = new Trainer();
        trainer.setEmail("pluto@email.com");
        trainer.setFirstName("Pluto");
        trainer.setLastName("Pluto");
        trainer.setPassword(password);
        trainer.setVerified(true);
        trainer.setRoles(roles);
        trainer.setGym(gym);
        return trainer;
    }

    private Gym createGym() {
        Gym gym = new Gym();
        gym.setName("MyGym");
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
