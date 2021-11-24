package it.gym.controller;

import it.gym.exception.UnAuthorizedException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.security.Principal;

@Controller
public class PrincipalController {

  private final Logger logger = LoggerFactory.getLogger(getClass());

  @GetMapping("/user")
  @ResponseBody
  public Principal user(Principal user) {
    if (user == null) {
      logger.info("this is null");
      throw new UnAuthorizedException("Authenticazione necessaria");
    } else logger.info(user.toString());
    return user;
  }
}
