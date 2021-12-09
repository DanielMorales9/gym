package it.gym.facade;

import com.fasterxml.jackson.databind.ObjectMapper;
import it.gym.model.Workout;
import it.gym.service.WorkoutService;
import java.io.IOException;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import javax.servlet.http.HttpServletRequest;
import javax.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

@Component
@Transactional
public class WorkoutFacade {

  private final WorkoutService service;

  private final ObjectMapper objectMapper;

  public WorkoutFacade(WorkoutService service, ObjectMapper objectMapper) {
    this.service = service;
    this.objectMapper = objectMapper;
  }

  public Workout findById(Long var1) {
    return service.findById(var1);
  }

  public Workout save(Workout w) {
    return service.save(w);
  }

  public List<Workout> findAll() {
    return service.findAll();
  }

  public void deleteById(Long id) {
    Workout w = service.findById(id);
    service.delete(w);
  }

  public Page<Workout> findAll(Pageable pageable) {
    return service.findAll(pageable);
  }

  public Workout patch(Long id, HttpServletRequest request) throws IOException {
    Workout w = service.findById(id);
    w = objectMapper.readerForUpdating(w).readValue(request.getReader());
    return service.save(w);
  }

  public Page<Workout> search(
      String name, String tag, Boolean isTemplate, Pageable pageable) {
    return this.service.search(name, tag, isTemplate, pageable);
  }

  public List<String> getTags() {
    return this.findAll().stream()
        .map(
            workout ->
                Arrays.asList(
                    workout.getTag1(), workout.getTag2(), workout.getTag3()))
        .flatMap(Collection::stream)
        .filter(Objects::nonNull)
        .distinct()
        .collect(Collectors.toList());
  }
}
