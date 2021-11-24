package it.gym.mappers;

import it.gym.model.AUser;
import it.gym.pojo.UserDTO;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

  public UserDTO toDTO(AUser user, boolean mapRoles) {

    return new UserDTO(
        user.getId(),
        user.getFirstName(),
        user.getLastName(),
        user.getEmail(),
        user.getCreatedAt(),
        user.getPhoneNumber(),
        user.getType(),
        user.isVerified(),
        user.isGender(),
        mapRoles ? user.getRoles() : null);
  }
}
