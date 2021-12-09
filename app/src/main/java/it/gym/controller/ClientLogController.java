package it.gym.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/log")
public class ClientLogController {

  private final Logger logger = LoggerFactory.getLogger(getClass());

  @PostMapping(path = "/error")
  public void error(@RequestBody String message) {
    logger.error("Client: " + message.replaceAll("\n", " "));
  }

  @PostMapping(path = "/info")
  public void info(@RequestBody String message) {
    logger.info("Client: " + message.replaceAll("\n", " "));
  }
}
