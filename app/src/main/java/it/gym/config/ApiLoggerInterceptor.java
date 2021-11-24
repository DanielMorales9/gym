package it.gym.config;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.AnyNestedCondition;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Conditional;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

class ProdAndDevCondition extends AnyNestedCondition {

  public ProdAndDevCondition() {
    super(ConfigurationPhase.PARSE_CONFIGURATION);
  }

  @ConditionalOnProperty(name = "spring.profiles", havingValue = "prod")
  static class Value1Condition {}

  @ConditionalOnProperty(name = "spring.profiles", havingValue = "dev")
  static class Value2Condition {}
}

@Component
@Conditional(ProdAndDevCondition.class)
public class ApiLoggerInterceptor implements HandlerInterceptor {

  private static final Logger logger =
      LoggerFactory.getLogger(ApiLoggerInterceptor.class);

  @Override
  public boolean preHandle(
      HttpServletRequest request,
      HttpServletResponse response,
      Object handler) {
    long startTime = System.currentTimeMillis();
    request.setAttribute("startTime", startTime);
    return true;
  }

  @Override
  public void afterCompletion(
      HttpServletRequest request,
      HttpServletResponse response,
      Object handler,
      Exception ex)
      throws Exception {
    String path =
        request.getRequestURI().substring(request.getContextPath().length());
    long startTime = (Long) request.getAttribute("startTime");
    long endTime = System.currentTimeMillis();
    long executeTime = endTime - startTime;
    logger.info(
        "Method: "
            + request.getMethod()
            + " Resource: "
            + path
            + " Duration: "
            + executeTime);
  }
}
