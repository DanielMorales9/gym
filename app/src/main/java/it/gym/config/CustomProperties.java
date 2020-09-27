package it.gym.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.stereotype.Service;

@Service
@EnableScheduling
@PropertySource("application.yml")
public class CustomProperties {

    @Value("${adminEmail:admin@admin.com}")
    private String adminEmail;

    @Value("${defaultPassword:password}")
    private String defaultPassword;

    @Value("${schema:default}")
    private String schema;

    @Value("${baseUrl:http://localhost}")
    private String baseURL;

    @Value("${rememberMeToken:default}")
    private String rememberMeToken;

    @Value("${rememberMeCookie:X-REMEMBER-ME}")
    private String rememberMeCookie;

    @Value("${rememberMeParameter:rememberMe}")
    private String rememberMeParameter;

    @Value("${rememberMeAlways:false}")
    private Boolean rememberMeAlways;

    public String getAdminEmail() {
        return adminEmail;
    }

    public String getDefaultPassword() {
        return defaultPassword;
    }

    public String getSchema() {
        return schema;
    }

    public String getBaseURL() {
        return baseURL;
    }

    public String getRememberMeToken() {
        return rememberMeToken;
    }

    public String getRememberMeCookie() {
        return rememberMeCookie;
    }

    public String getRememberMeParameter() {
        return rememberMeParameter;
    }

    public boolean getRememberMeAlways() {
        return rememberMeAlways;
    }
}


