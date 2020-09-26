package it.gym.config;

import org.hibernate.context.spi.CurrentTenantIdentifierResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.stereotype.Component;

@Component
@EnableScheduling
@ConditionalOnProperty(
        name = "it.gym.enabled",
        havingValue = "true",
        matchIfMissing = true)
public class TenantSchemaResolver implements CurrentTenantIdentifierResolver {

    @Autowired
    CustomProperties properties;

    @Override
    public String resolveCurrentTenantIdentifier() {
        String t =  TenantContext.getCurrentTenant();
        if(t!=null){
            return t;
        } else {
            return properties.getSchema();
        }
    }

    @Override
    public boolean validateExistingCurrentSessions() {
        return true;
    }

}
