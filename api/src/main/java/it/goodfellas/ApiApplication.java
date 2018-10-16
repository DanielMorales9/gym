package it.goodfellas;

import java.security.Principal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.web.bind.annotation.*;

@SpringBootApplication
@RestController
public class ApiApplication extends WebSecurityConfigurerAdapter {

	private final static org.slf4j.Logger logger = LoggerFactory.getLogger(ApiApplication.class);

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		// @formatter:off
		http
				.httpBasic().and()
				.authorizeRequests()
				.antMatchers("/", "/home", "/user",
                        "/logout", "/login", "/profile", "/profile/*",
						"/verification*", "/auth/**/*").permitAll()
				.anyRequest().authenticated()
				.and().exceptionHandling().authenticationEntryPoint(authenticationEntryPoint())
				.and().csrf()
				.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse());
		// @formatter:on
	}

	@Bean
	protected IUserAuthService userDetailsService() {
		return new UserAuthService();
	}

	@Bean
	public AuthenticationEntryPoint authenticationEntryPoint() {
		return (request, response, authException) -> {
			if (request.getUserPrincipal() == null) {
				response.setStatus(403);
				response.sendRedirect("/");
			}
		};
	};

	@Bean
	public BCryptPasswordEncoder passwordEncoder(){
		return new BCryptPasswordEncoder();
	}

	@Bean
	public AuthenticationManager authenticationManagerBean() throws Exception {
		return super.authenticationManagerBean();
	}

	@Autowired
	protected void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
		auth.userDetailsService(userDetailsService()).passwordEncoder(passwordEncoder());
	}

	@RequestMapping("/user")
	@ResponseBody
	public Principal user(Principal user) {
		if (user == null){
			logger.info("this is null");
		}
		else {
			logger.info(user.toString());
		}
		return user;
	}

	public static void main(String[] args) {
		SpringApplication.run(ApiApplication.class, args);
	}

}
