package it.gym.service;

import it.gym.exception.GymNotFoundException;
import it.gym.exception.InvalidReservationException;
import it.gym.exception.InvalidTimeException;
import it.gym.facade.ReservationFacade;
import it.gym.model.Gym;
import it.gym.repository.GymRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Date;
import java.util.List;

@Service
@Transactional
public class GymService implements ICrudService<Gym, Long> {

    @Autowired private GymRepository gymRepository;

    @Override
    public Gym save(Gym var1) {
        return this.gymRepository.save(var1);
    }

    @Override
    public Gym findById(Long var1) {
        return this.gymRepository.findById(var1).orElseThrow(GymNotFoundException::new);
    }

    @Override
    public void delete(Gym var1) {
        this.gymRepository.delete(var1);
    }

    @Override
    public List<Gym> findAll() {
        return this.gymRepository.findAll();
    }

    public void isValidInterval(Date startTime, Date endTime) {
        if (startTime.after(endTime) || isPast(startTime))
            throw new InvalidReservationException("Data Non Valida");
    }

    boolean isPast(Date date) {
        return date.before(new Date());
    }

    public void isWithinWorkingHours(Long gymId, Date start, Date end) {
        Gym gym = findById(gymId);
        if (!gym.isValidDate(start, end)) throw new InvalidTimeException("Data non valida");
    }
}
