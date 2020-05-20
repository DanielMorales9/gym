package it.gym.service;

import it.gym.exception.BadRequestException;
import it.gym.exception.NotFoundException;
import it.gym.model.Gym;
import it.gym.repository.GymRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Date;
import java.util.List;

import static it.gym.utility.CheckEvents.checkInterval;

@Service
@Transactional
public class GymService implements ICrudService<Gym, Long> {

    @Autowired private GymRepository gymRepository;

    @Caching(
            put = {
                    @CachePut(value = "gyms-single", key = "#result.id"),
            },
            evict = {
                    @CacheEvict(value = "gyms-all", allEntries = true)
            }
    )
    @Override
    public Gym save(Gym var1) {
        return this.gymRepository.save(var1);
    }

    @CachePut(value = "gyms-single", key = "#result.id")
    @Override
    public Gym findById(Long var1) {
        return this.gymRepository.findById(var1).orElseThrow(() -> new NotFoundException("La palestra non esiste"));
    }

    @Caching(
            evict = {
                    @CacheEvict(value = "gyms-single", key = "#var1.id"),
                    @CacheEvict(value = "gyms-all", allEntries = true)
            }
    )
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
}
