package it.goodfellas;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
    public class InitializeDatabase implements CommandLineRunner {

        private final RoleRepository roleRepository;
        private final AdminRepository adminRepository;
        private final BCryptPasswordEncoder bCryptPasswordEncoder;

  @Autowired
  public InitializeDatabase(RoleRepository roleRepository,
                            AdminRepository adminRepository,
                            BCryptPasswordEncoder bCryptPasswordEncoder) {
    this.roleRepository = roleRepository;
    this.adminRepository = adminRepository;
    this.bCryptPasswordEncoder = bCryptPasswordEncoder;
  }

  @Override
        public void run(String... args) {
            Arrays.asList(Constants.ROLE_NAMES)
                    .forEach(
                            a -> {
                                Role role = new Role();
                                role.setName(a);
                                roleRepository.save(role);
                            });

            List<Role> roles = this.roleRepository.findAllById(Arrays.asList(Constants.ROLES));
            Admin admin = new Admin();
            admin.setEmail("admin@admin.com");
            admin.setPassword(bCryptPasswordEncoder.encode("password"));
            admin.setFirstName("Admin");
            admin.setVerified(true);
            admin.setLastName("Admin");
            admin.setRoles(roles);
            adminRepository.save(admin);
        }
    }
