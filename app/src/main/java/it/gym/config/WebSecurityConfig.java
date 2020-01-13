package it.gym.config;

import it.gym.service.UserAuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.Environment;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;

@EnableGlobalMethodSecurity(prePostEnabled = true)
@EnableScheduling
@ConditionalOnProperty(
        name = "it.gym.enabled",
        havingValue = "true",
        matchIfMissing = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    MultiTenancyInterceptor tenancyInterceptor;

    private final Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    @Qualifier("userAuthService")
    UserAuthService userDetailsService;

    @Autowired
    private Environment env;

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
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Autowired
    protected void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(this.userDetailsService).passwordEncoder(passwordEncoder());
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }


    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .httpBasic().and()
                .authorizeRequests()
                .antMatchers("/",
                        "/user",
                        "/logout",
                        "/authentication/**",
                        "/login",
                        "/actuator/*").permitAll()
                .anyRequest().authenticated()
                .and().exceptionHandling().authenticationEntryPoint(authenticationEntryPoint())
                .and().addFilterBefore(tenancyInterceptor, BasicAuthenticationFilter.class);

        if (env.getActiveProfiles()[0].equals("dev")) {
                http.csrf().disable();
        } else {
            http.csrf().csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse());
        }


    }
}
