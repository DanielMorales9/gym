package it.gym.config;

import it.gym.service.UserAuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.RememberMeAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.access.intercept.FilterSecurityInterceptor;
import org.springframework.security.web.authentication.rememberme.RememberMeAuthenticationFilter;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.security.web.context.request.async.WebAsyncManagerIntegrationFilter;

@EnableGlobalMethodSecurity(prePostEnabled = true)
@EnableScheduling
@ConditionalOnProperty(
        name = "it.gym.enabled",
        havingValue = "true",
        matchIfMissing = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired CustomProperties properties;
    @Autowired MultiTenancyInterceptor tenancyInterceptor;
    @Autowired @Qualifier("userAuthService") UserAuthService userDetailsService;

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
        auth.authenticationProvider(rememberMeAuthenticationProvider());

    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public TokenBasedRememberMeService tokenBasedRememberMeService(){
        TokenBasedRememberMeService service =
                new TokenBasedRememberMeService(properties.getRememberMeToken(), userDetailsService);
        service.setAlwaysRemember(properties.getRememberMeAlways());
        service.setCookieName(properties.getRememberMeCookie());
        service.setParameter(properties.getRememberMeParameter());
        return service;
    }

    @Bean public RememberMeAuthenticationFilter rememberMeAuthenticationFilter() throws Exception{
        return new RememberMeAuthenticationFilter(authenticationManager(), tokenBasedRememberMeService());
    }

    @Bean
    RememberMeAuthenticationProvider rememberMeAuthenticationProvider(){
        return new RememberMeAuthenticationProvider(properties.getRememberMeToken());
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .csrf()
                .disable()
                .httpBasic()
                .and()
                .authorizeRequests()
                .antMatchers(
                        "/",
                        "/user",
                        "/logout",
                        "/authentication/**",
                        "/gyms/**",
                        "/log/**",
                        "/login",
                        "/actuator/*").permitAll()
                .and().authorizeRequests().anyRequest().authenticated()
                .and()
                    .exceptionHandling().authenticationEntryPoint(authenticationEntryPoint())
                .and()
                    .addFilterBefore(tenancyInterceptor, BasicAuthenticationFilter.class)
                    .addFilterBefore(rememberMeAuthenticationFilter(), BasicAuthenticationFilter.class)
                .rememberMe()
                    .rememberMeServices(tokenBasedRememberMeService());
        ;
        //.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse());
    }
}
