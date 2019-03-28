package it.gym.service;

import it.gym.exception.NotFoundException;
import it.gym.model.Trainer;
import it.gym.repository.TrainerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrainerService implements ICrudService<Trainer, Long> {

    private final TrainerRepository trainerRepository;

    @Autowired
    public TrainerService(TrainerRepository trainerRepository) {
        this.trainerRepository = trainerRepository;
    }


    @Override
    public Trainer save(Trainer var1) {
        return this.trainerRepository.save(var1);
    }

    @Override
    public Trainer findById(Long var1) {
        return this.trainerRepository.findById(var1)
                .orElseThrow(() -> new NotFoundException("Trainer", var1));
    }

    @Override
    public void delete(Trainer var1) {
        this.trainerRepository.delete(var1);
    }

    @Override
    public List<Trainer> findAll() {
        return this.trainerRepository.findAll();
    }
}
