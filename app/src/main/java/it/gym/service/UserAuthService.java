package it.gym.service;

import it.gym.model.AUser;
import it.gym.model.Role;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Collection;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserAuthService implements UserDetailsService {

  private static final Logger logger =
      LoggerFactory.getLogger(UserAuthService.class);

  @Autowired private UserService userService;

  @Override
  public UserDetails loadUserByUsername(String email) {
    logger.info(String.format("The email %s", email));
    AUser user = userService.findByEmail(email);
    if (user == null) {
      throw new UsernameNotFoundException(
          String.format("Nessun utente con questa email: %s", email));
    }
    User u =
        new User(
            user.getEmail(),
            user.getPassword(),
            user.isVerified(),
            true,
            true,
            true,
            mapRolesToAuthorities(user.getRoles()));
    return u;
  }

  private Collection<? extends GrantedAuthority> mapRolesToAuthorities(
      Collection<Role> roles) {
    return roles.stream()
        .map(role -> new SimpleGrantedAuthority(role.getName()))
        .collect(Collectors.toList());
  }
}
