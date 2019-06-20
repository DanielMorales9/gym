package it.gym;

import it.gym.model.Admin;
import it.gym.model.Gym;
import it.gym.model.Role;
import it.gym.repository.AdminRepository;
import it.gym.repository.GymRepository;
import it.gym.repository.RoleRepository;
import it.gym.utility.Constants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
import java.util.Arrays;
import java.util.List;

@Component
public class InitializeDatabase implements CommandLineRunner {

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
        Arrays.asList(Constants.ROLE_NAME_ADMIN,
                Constants.ROLE_NAME_TRAINER,
                Constants.ROLE_NAME_CUSTOMER)
                .forEach(a -> {
                            Role role = new Role();
                            role.setName(a);
                            roleRepository.save(role);
                        });

        String email = "goodfellas.personaltraining@gmail.com";
        if (adminRepository.findByEmail(email) == null) {
            List<Role> roles = this.roleRepository.findAllById(
                    Arrays.asList(
                            Constants.ROLE_ID_ADMIN,
                            Constants.ROLE_ID_TRAINER,
                            Constants.ROLE_ID_CUSTOMER));
            String password = bCryptPasswordEncoder.encode("password");
            Gym gym = createGym();
            gymRepository.save(gym);
            Admin admin = createAdmin(email, password, gym, roles);
            adminRepository.save(admin);
        }
    }

    private Admin createAdmin(String email, String password, Gym gym, List<Role> roles) {
        Admin admin = new Admin();
        admin.setEmail(email);
        admin.setFirstName("Admin");
        admin.setLastName("Admin");
        admin.setPassword(password);
        admin.setVerified(true);
        admin.setRoles(roles);
        admin.setGym(gym);
        return admin;
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
