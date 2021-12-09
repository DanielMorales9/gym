package it.gym.service;

import static it.gym.utility.CheckEvents.checkInterval;

import com.fasterxml.jackson.databind.ObjectMapper;
import it.gym.exception.BadRequestException;
import it.gym.exception.NotFoundException;
import it.gym.model.Gym;
import it.gym.pojo.Icon;
import it.gym.pojo.Manifest;
import it.gym.repository.GymRepository;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class GymService implements ICrudService<Gym, Long> {

  @Autowired private GymRepository gymRepository;
  @Autowired private ObjectMapper objectMapper;

  @Caching(
      put = {
        @CachePut(
            value = "gyms-single",
            key = "#result.id",
            condition = "#result != null"),
      },
      evict = {@CacheEvict(value = "gyms-all", allEntries = true)})
  @Override
  public Gym save(Gym var1) {
    return this.gymRepository.save(var1);
  }

  @CachePut(
      value = "gyms-single",
      key = "#result.id",
      condition = "#result != null")
  @Override
  public Gym findById(Long var1) {
    return this.gymRepository
        .findById(var1)
        .orElseThrow(() -> new NotFoundException("La palestra non esiste"));
  }

  @Caching(
      evict = {
        @CacheEvict(value = "gyms-single", key = "#var1.id"),
        @CacheEvict(value = "gyms-all", allEntries = true)
      })
  @Override
  public void delete(Gym var1) {
    this.gymRepository.delete(var1);
  }

  @Override
  public List<Gym> findAll() {
    return this.gymRepository.findAll();
  }

  public boolean isWithinWorkingHours(Gym gym, Date start, Date end) {
    return gym.isValidDate(start, end);
  }

  public void checkGymHours(Gym gym, Date startTime, Date endTime) {
    checkInterval(startTime, endTime);

    checkWorkingHours(gym, startTime, endTime);
  }

  private void checkWorkingHours(Gym gym, Date startTime, Date endTime) {
    boolean isOk = !isWithinWorkingHours(gym, startTime, endTime);
    if (isOk)
      throw new BadRequestException("La palestra è chiusa in questo orario");
  }

  @Cacheable(value = "manifest")
  public Manifest getManifest() {
    Gym gym = this.findAll().get(0);

    Manifest manifest = new Manifest();
    manifest.setName(gym.getFullName());
    manifest.setShort_name(gym.getName());
    manifest.setTheme_color(gym.getThemeColor());
    manifest.setBackground_color(gym.getBackgroundColor());

    // TODO This is Hard coded and needs to be dynamic
    ArrayList<Icon> icons = new ArrayList<>();
    Icon icon0 =
        new Icon(
            "/src/assets/icons/android-chrome-192x192.png",
            "192x192",
            "image/png");
    Icon icon1 =
        new Icon(
            "/src/assets/icons/android-chrome-512x512.png",
            "512x512",
            "image/png");
    Icon icon2 =
        new Icon("/src/assets/icons/favicon-16x16.png", "16x16", "image/png");
    Icon icon3 =
        new Icon("/src/assets/icons/favicon-32x32.png", "32x32", "image/png");
    icons.add(icon0);
    icons.add(icon1);
    icons.add(icon2);
    icons.add(icon3);

    manifest.setIcons(icons);
    return manifest;
  }

  public Gym patch(Long id, HttpServletRequest request) throws IOException {
    Gym gym =
        gymRepository
            .findById(id)
            .orElseThrow(() -> new NotFoundException("La palestra non esiste"));
    ;
    gym = objectMapper.readerForUpdating(gym).readValue(request.getReader());
    gym = gymRepository.save(gym);
    return gym;
  }
}
