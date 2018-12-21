package it.goodfellas;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

import it.goodfellas.model.*;
import it.goodfellas.service.IUserAuthService;
import it.goodfellas.service.UserAuthService;
import org.apache.catalina.Context;
import org.apache.catalina.connector.Connector;
import org.apache.tomcat.util.descriptor.web.SecurityCollection;
import org.apache.tomcat.util.descriptor.web.SecurityConstraint;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.servlet.server.ServletWebServerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurerAdapter;
import org.springframework.hateoas.core.EvoInflectorRelProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.session.data.redis.config.annotation.web.http.EnableRedisHttpSession;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

@SpringBootApplication
@Controller
@EnableRedisHttpSession
public class ApiApplication extends WebSecurityConfigurerAdapter {

	private final static org.slf4j.Logger logger = LoggerFactory.getLogger(ApiApplication.class);

	@RequestMapping({ "/", "/home*", "/home/**/*", "/home/**",
            "/profile/**/*", "/profile/*",  "/logout",
            "/auth/**/*", "/auth/*"})
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
				.antMatchers("/", "/home", "/user",
                        "/logout", "/login", "/profile", "/profile/*",
						"/verification*",  "/auth/*", "/auth/**/*",
						"/authentication/**/*", "/authentication/*").permitAll()
				.anyRequest().authenticated()
				.and().exceptionHandling().authenticationEntryPoint(authenticationEntryPoint())
				.and().csrf()
				.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse());
		// @formatter:on
	}

	@Override
	public void configure(WebSecurity web) throws Exception {
		web.ignoring().antMatchers("/favicon.ico", "/*.html", "/*.js", "/*.css", "/**/*.txt");

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
	};

	@Autowired @Qualifier("userAuthService")
	UserAuthService userDetailsService;

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
