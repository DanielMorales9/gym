package it.gym.service;

import it.gym.exception.NotFoundException;
import it.gym.model.ATrainingBundle;
import it.gym.model.ATrainingBundleSpecification;
import it.gym.model.CourseTrainingBundle;
import it.gym.repository.CourseTrainingBundleRepository;
import it.gym.repository.TrainingBundleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TrainingBundleService implements ICrudService<ATrainingBundle, Long> {

    @Autowired
    private TrainingBundleRepository repository;

    @Autowired
    private CourseTrainingBundleRepository courseRepository;

    public ATrainingBundle save(ATrainingBundle var1) {
        return this.repository.save(var1);
    }

    public ATrainingBundle findById(Long var1) {
        return this.repository.findById(var1).orElseThrow(() -> new NotFoundException("Pacchetto", var1));
    }

    public void delete(ATrainingBundle var1) {
        this.repository.delete(var1);
    }

    public List<ATrainingBundle> findAll() {
        return this.repository.findAll();
    }

    public Page<ATrainingBundle> findAll(Pageable pageable) {
        return this.repository.findAll(pageable);
    }

    public List<ATrainingBundle> findBundlesBySpec(ATrainingBundleSpecification spec) {
        return this.repository.findATrainingBundleByBundleSpec(spec);
    }

    public Page<ATrainingBundle> findBundlesBySpecId(Long id, Pageable pageable) {
        return this.repository.findATrainingBundleByBundleSpec_Id(id, pageable);
    }

    public List<CourseTrainingBundle> findCoursesLargerThanInterval(Date startTime, Date endTime) {
        return courseRepository.findCoursesByInterval(startTime, endTime);
    }

    public void deleteAll(List<ATrainingBundle> bundles) {
        this.repository.deleteAll(bundles);
    }

    public List<ATrainingBundle> findBundlesBySpecIdNotExpired(Long specId) {
        return repository.findATrainingBundleByBundleSpec_Id(specId).stream()
                .filter(bundle -> !bundle.isExpired()).collect(Collectors.toList());
    }
}
