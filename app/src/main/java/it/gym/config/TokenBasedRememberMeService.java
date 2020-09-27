package it.gym.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.rememberme.TokenBasedRememberMeServices;

import javax.servlet.http.HttpServletRequest;

public class TokenBasedRememberMeService extends TokenBasedRememberMeServices {

    private static final Logger logger = LoggerFactory.getLogger(TokenBasedRememberMeService.class);
    @Autowired CustomProperties customProperties;

    public TokenBasedRememberMeService(String key, UserDetailsService userDetailsService) {
        super(key, userDetailsService);
    }

    /**
     * Locates the Spring Security remember me token in the request and returns its value.
     *
     * @param request the submitted request which is to be authenticated
     * @return the value of the request header (which was originally provided by the cookie - API expects it in header)
     */
    @Override protected String extractRememberMeCookie(HttpServletRequest request) {
        String token = request.getHeader(customProperties.getRememberMeCookie());
        if ((token == null) || (token.length() == 0)) {
            return null;
        }

        return token;
    }
}