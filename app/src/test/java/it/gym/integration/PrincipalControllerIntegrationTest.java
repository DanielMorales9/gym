package it.gym.integration;


import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.test.context.support.WithAnonymousUser;
import org.springframework.test.web.servlet.MvcResult;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class PrincipalControllerIntegrationTest extends AbstractIntegrationTest {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    @Test
    public void whenAsksForPrincipal_returnsPrincipal() throws Exception {
        MvcResult result = mockMvc.perform(get("/user"))
                .andExpect(status().isOk()).andReturn();
        String content = result.getResponse().getContentAsString();
        assertThat(content).isNotEqualToIgnoringCase("");
    }

    @Test
    @WithAnonymousUser
    public void whenAsksForPrincipal_returnsNull() throws Exception {
        mockMvc.perform(get("/user"))
                .andExpect(status().isUnauthorized()).andReturn();
    }
}
