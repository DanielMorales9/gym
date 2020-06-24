package it.gym.config;

import it.gym.model.Tenant;
import it.gym.repository.TenantRepository;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;

import static it.gym.config.TenantConnectionProvider.DEFAULT_TENANT;

@Component
@EnableScheduling
@ConditionalOnProperty(
        name = "it.gym.enabled",
        havingValue = "true",
        matchIfMissing = true)
public class MultiTenancyInterceptor extends OncePerRequestFilter {

    @Autowired
    TenantRepository repository;

    @Override
    public void doFilterInternal(HttpServletRequest request,
                                 @NotNull HttpServletResponse response,
                                 FilterChain filterChain) throws IOException, ServletException {
        String tenantUuid = request.getHeader("X-Tenant");
        logger.debug("preHandle TenantContext");
        Tenant tenant = tenantUuid != null? repository.findById(tenantUuid).orElse(null): null;
        String schema = tenant != null ? tenant.getSchemaName(): DEFAULT_TENANT;
        TenantContext.setCurrentTenantSchema(schema);
        filterChain.doFilter(request, response);
    }
}
