package it.goodfellas;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.session.data.redis.config.annotation.web.http.EnableRedisHttpSession;
import org.springframework.session.web.context.AbstractHttpSessionApplicationInitializer;

@PropertySource("application.yml")
@Configuration
@EnableRedisHttpSession
public class SessionConfig extends AbstractHttpSessionApplicationInitializer {

  @Value("${spring.redis.host}")
  private String redisHostName;

  @Value("${spring.redis.port}")
  private int redisPort;

  public SessionConfig() {
    super(SessionConfig.class);
  }

  @Bean
  public LettuceConnectionFactory connectionFactory() {
    LettuceConnectionFactory factory = new LettuceConnectionFactory();
    factory.setHostName(redisHostName);
    factory.setPort(redisPort);
    return factory;
  }


}
