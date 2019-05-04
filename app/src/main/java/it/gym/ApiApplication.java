package it.gym;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import it.gym.model.*;
import it.gym.service.UserAuthService;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurerAdapter;
import org.springframework.hateoas.core.EvoInflectorRelProvider;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.session.data.redis.config.ConfigureRedisAction;
import org.springframework.session.data.redis.config.annotation.web.http.EnableRedisHttpSession;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@SpringBootApplication
@Controller
@EnableRedisHttpSession
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class ApiApplication extends WebSecurityConfigurerAdapter {

	private final static org.slf4j.Logger logger = LoggerFactory.getLogger(ApiApplication.class);

	@Autowired @Qualifier("userAuthService")
	UserAuthService userDetailsService;

	@RequestMapping({
			"/",
			"/logout",
			"/home/**",
			"/admin/**",
			"/trainer/**",
			"/customer/**",
			"/profile/**",
			"/auth/**"})
	public String publicAPI() {
		return "forward:/index.html";
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

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		// @formatter:off
		http
				.httpBasic().and()
				.authorizeRequests()
				.antMatchers("/",
						"/user",
						"/logout",
						"/login",
						"/actuator/*",
						"/home/**",
						"/verification/**",
						"/authentication/**",
						"/auth/**",
						"/socket/**").permitAll()
				.anyRequest().authenticated()
				.and().exceptionHandling().authenticationEntryPoint(authenticationEntryPoint())
				.and().csrf()
				.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse());
		// @formatter:on
	}

	@Override
	public void configure(WebSecurity web) {
		web.ignoring().antMatchers("/favicon.ico", "/*.html", "/*.js", "/*.css");

	}

	public static void main(String[] args) {
		SpringApplication.run(ApiApplication.class, args);
	}

	@Bean
	public AuthenticationEntryPoint authenticationEntryPoint() {
		return (request, response, authException) -> {
			if (request.getUserPrincipal() == null) {
				response.setStatus(403);
				response.sendRedirect("/");
			}
			else {
				logger.info(request.getUserPrincipal().toString());
			}
		};
	}

	@Bean
	public static ConfigureRedisAction configureRedisAction() {
		return ConfigureRedisAction.NO_OP;
	}

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
		auth.userDetailsService(this.userDetailsService).passwordEncoder(passwordEncoder());
	}

	@Configuration
	@Scope(value = ConfigurableBeanFactory.SCOPE_SINGLETON)
	public class BundleSpecTypesMapper {

		private Map<String, String> mapper;

		public BundleSpecTypesMapper() {
			this.mapper = new HashMap<>();
			this.mapper.put("P", PersonalTrainingBundleSpecification.class.getSimpleName());
		}

		public String getBundleSpecClass(String type) {
			return mapper.get(type);
		}
	}

	@Component
	@Order(Ordered.HIGHEST_PRECEDENCE)
	public class RelProvider extends EvoInflectorRelProvider {
		@Override
		public String getCollectionResourceRelFor(final Class<?> type) {
			return super.getCollectionResourceRelFor(ATrainingBundleSpecification.class);
		}

		@Override
		public String getItemResourceRelFor(final Class<?> type) {
			return super.getItemResourceRelFor(ATrainingBundleSpecification.class);
		}

		@Override
		public boolean supports(final Class<?> delimiter) {
			return ATrainingBundleSpecification.class.isAssignableFrom(delimiter);
		}
	}

	@Bean
	public Jackson2ObjectMapperBuilder objectMapperBuilder() {
		return new Jackson2ObjectMapperBuilder() {
			public void configure(ObjectMapper objectMapper) {
				objectMapper.disable(SerializationFeature.FAIL_ON_UNWRAPPED_TYPE_IDENTIFIERS);
				objectMapper.registerSubtypes(PersonalTrainingBundleSpecification.class);
				objectMapper.registerSubtypes(PersonalTrainingBundle.class);
				super.configure(objectMapper);
			};
		};
	}

	@Configuration
	@Scope(value = ConfigurableBeanFactory.SCOPE_SINGLETON)
	public class TrainingTypesMapper {

		private Map<String, String> mapper;

		public TrainingTypesMapper () {
			this.mapper = new HashMap<>();
			this.mapper.put("P", PersonalTrainingBundle.class.getSimpleName());
		}

		public String getTrainingClass(String type) {
			return mapper.get(type);
		}
	}

	@Component
	public class ExposeEntityIdRestMvcConfiguration extends RepositoryRestConfigurerAdapter {

		@Override
		public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) {
			config.exposeIdsFor(AUser.class,
					Sale.class,
					SalesLineItem.class,
					TimeOff.class,
					Reservation.class,
					ATrainingBundleSpecification.class,
					PersonalTrainingBundleSpecification.class,
					Admin.class,
					Customer.class,
					Trainer.class);

		}
	}
}
