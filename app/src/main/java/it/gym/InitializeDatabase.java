package it.gym;

import it.gym.model.Admin;
import it.gym.model.Gym;
import it.gym.model.Role;
import it.gym.repository.AdminRepository;
import it.gym.repository.GymRepository;
import it.gym.repository.RoleRepository;
import it.gym.utility.Constants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
import java.util.Arrays;
import java.util.Calendar;
import java.util.List;

@Component
public class InitializeDatabase implements CommandLineRunner {

    private final Logger logger = LoggerFactory.getLogger(InitializeDatabase.class);
    private final RoleRepository roleRepository;
    private final AdminRepository adminRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final GymRepository gymRepository;

    @Autowired
    public InitializeDatabase(RoleRepository roleRepository,
                              AdminRepository adminRepository,
                              BCryptPasswordEncoder bCryptPasswordEncoder,
                              GymRepository gymRepository) {
        this.roleRepository = roleRepository;
        this.adminRepository = adminRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.gymRepository = gymRepository;
    }

    @Override
    public void run(String... args) {
        // TODO change roles to enum
        Arrays.asList(Constants.ROLE_NAMES)
                .forEach(
                        a -> {
                            Role role = new Role();
                            role.setName(a);
                            roleRepository.save(role);
                        });

        String email = "goodfellas.personaltraining@gmail.com";
        if (adminRepository.findByEmail(email) == null) {
            List<Role> roles = this.roleRepository.findAllById(Arrays.asList(Constants.ROLES));
            String password = bCryptPasswordEncoder.encode("password");
            Admin admin = new Admin("Admin", "Admin", email, password, true);
            Gym gym = initGym();
            gymRepository.save(gym);
            admin.setRoles(roles);
            admin.setGym(gym);
            adminRepository.save(admin);
        }
    }

    private Gym initGym() {
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
