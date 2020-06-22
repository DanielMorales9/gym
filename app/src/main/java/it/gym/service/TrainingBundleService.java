package it.gym.service;

import it.gym.exception.NotFoundException;
import it.gym.model.ATrainingBundle;
import it.gym.model.ATrainingBundleSpecification;
import it.gym.repository.TrainingBundleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class TrainingBundleService implements ICrudService<ATrainingBundle, Long> {

    @Autowired
    private TrainingBundleRepository repository;

    @Caching(
            put = {
                    @CachePut(value = "bundles-single", key = "#result.id", condition="#result != null")
            },
            evict = {
                    @CacheEvict(value = "bundles-all", allEntries = true)
            }
    )
    public ATrainingBundle save(ATrainingBundle var1) {
        return this.repository.save(var1);
    }

    @CachePut(value = "bundles-single", key = "#result.id", condition="#result != null")
    public ATrainingBundle findById(Long var1) {
        return this.repository.findById(var1).orElseThrow(() -> new NotFoundException("Pacchetto", var1));
    }

    @Caching(
            evict = {
                    @CacheEvict(value = "bundles-single", key = "#var1.id"),
                    @CacheEvict(value = "bundles-all", allEntries = true),
                    @CacheEvict(value = "bundles-search", allEntries = true)
            }
    )
    public void delete(ATrainingBundle var1) {
        this.repository.delete(var1);
    }

    public List<ATrainingBundle> findAll() {
        return this.repository.findAll();
    }

    @CachePut(value = "bundles-all", condition="#result != null")
    public Page<ATrainingBundle> findAll(Pageable pageable) {
        return this.repository.findAll(pageable);
    }

    @CachePut(value = "bundles-search", condition="#result != null")
    public Page<ATrainingBundle> search(Long specId, Boolean expired, Date time, Pageable pageable) {

        Page<ATrainingBundle> bundles;
        if (specId != null) {
            bundles = this.findBundlesBySpecId(specId, pageable);
        }
        else if (expired != null && time != null) {
            if (expired) {
                bundles = this.findBundlesByExpiredAtGreaterThan(time, pageable);
            }
            else {
                bundles = this.findBundlesByCreatedAtGreaterThan(time, pageable);
            }
        }
        else if (time != null) {
            bundles = this.findBundlesByCreatedAtGreaterThan(time, pageable);
        }
        else if (expired != null) {
            if (expired) {
                bundles = this.findBundlesByExpired(pageable);
            }
            else {
                bundles = this.findBundlesByNotExpired(pageable);
            }
        }
        else {
            bundles = this.findAll(pageable);
        }
        return initAssociation(bundles);
    }

    @Caching(
            evict = {
                    @CacheEvict(value = "bundles-single", allEntries = true),
                    @CacheEvict(value = "bundles-all", allEntries = true),
                    @CacheEvict(value = "bundles-search", allEntries = true)
            }
    )
    public void deleteAll(List<ATrainingBundle> bundles) {
        this.repository.deleteAll(bundles);
    }

    @Caching(
            evict = {
                    @CacheEvict(value = "bundles-single", allEntries = true),
                    @CacheEvict(value = "bundles-all", allEntries = true),
                    @CacheEvict(value = "bundles-search", allEntries = true)
            }
    )
    public void saveAll(List<ATrainingBundle> bundles) {
        repository.saveAll(bundles);
    }


    public List<ATrainingBundle> findBundlesBySpec(ATrainingBundleSpecification spec) {
        return this.repository.findATrainingBundleByBundleSpec(spec);
    }

    public Page<ATrainingBundle> findBundlesBySpecId(Long id,  Pageable pageable) {
        return this.repository.findATrainingBundleByBundleSpec_Id(id, pageable);
    }

    public Page<ATrainingBundle> findBundlesByExpiredAtGreaterThan(Date time, Pageable pageable) {
        return repository.findBundlesByExpiredAtGreaterThan(time, pageable);
    }

    public Page<ATrainingBundle> findBundlesByCreatedAtGreaterThan(Date time, Pageable pageable) {
        return repository.findBundlesByCreatedAtGreaterThan(time, pageable);
    }

    public Page<ATrainingBundle> findBundlesByNotExpired(Pageable pageable) {
        return repository.findBundlesByExpiredAtNull(pageable);
    }

    public Page<ATrainingBundle> findBundlesByExpired(Pageable pageable) {
        return repository.findBundlesByExpiredAtNotNull(pageable);
    }

    private Page<ATrainingBundle> initAssociation(Page<ATrainingBundle> page) {
        return page.map(ATrainingBundle::eager);
    }

}
