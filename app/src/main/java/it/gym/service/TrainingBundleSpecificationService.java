package it.gym.service;

import it.gym.exception.NotFoundException;
import it.gym.model.*;
import it.gym.repository.TrainingBundleSpecificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.util.Streamable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TrainingBundleSpecificationService implements ICrudService<ATrainingBundleSpecification, Long> {

    @Autowired
    private TrainingBundleSpecificationRepository repository;

    @Caching(
            put = {
                    @CachePut(value = "specs-single", key = "#var1.id", condition="#result != null"),
            },
            evict = {
                    @CacheEvict(value = "specs-all", allEntries = true),
                    @CacheEvict(value = "specs-search", allEntries = true),
                    @CacheEvict(value = "specs-list", allEntries = true)
            }
    )
    public ATrainingBundleSpecification save(ATrainingBundleSpecification var1) {
        return this.repository.save(var1);
    }

    @Caching (
            put = {
                    @CachePut(value = "specs-single", key = "#var1", condition="#result != null"),
            }
    )
    public ATrainingBundleSpecification findById(Long var1) {
        return this.repository.findById(var1)
                .orElseThrow(() -> new NotFoundException("Pacchetto", var1));
    }

    @Cacheable(value = "specs-all")
    public Page<ATrainingBundleSpecification> findAll(Pageable pageable) {
        return initAssociation(repository.findAll(pageable));
    }

    @Cacheable(value = "specs-search")
    public Page<ATrainingBundleSpecification> search(String name, Boolean disabled, Pageable pageable) {
        Page<ATrainingBundleSpecification> page;
        if (disabled == null && name == null)
            page = this.findAll(pageable);
        else if (disabled == null) {
            page = this.findByNameContains(name, pageable);
        } else if (name == null) {
            page = this.findByIsDisabled(disabled, pageable);
        } else {
            page = this.findByNameAndIsDisabled(name, disabled, pageable);
        }
        return initAssociation(page);
    }

    @Cacheable(value = "specs-list")
    public List<ATrainingBundleSpecification> list(Boolean disabled, String type) {
        List<ATrainingBundleSpecification> bundles;
        if (disabled == null)
            bundles = this.findAll();
        else
            bundles = this.findByIsDisabled(disabled);

        if (type != null)
            bundles = bundles.stream().filter(a -> a.getType().equals(type)).collect(Collectors.toList());
        return initAssociationList(bundles);
    }

    private List<ATrainingBundleSpecification> initAssociationList(List<ATrainingBundleSpecification> bundles) {
        return bundles.stream().map(ATrainingBundleSpecification::eager).collect(Collectors.toList());
    }

    @Caching(
            evict = {
                    @CacheEvict(value = "specs-single", key = "#var1.id"),
                    @CacheEvict(value = "specs-all", allEntries = true),
                    @CacheEvict(value = "specs-search", allEntries = true),
                    @CacheEvict(value = "specs-list", allEntries = true)
            }
    )
    public void delete(ATrainingBundleSpecification var1) {
        this.repository.delete(var1);
    }

    public List<ATrainingBundleSpecification> findAll() {
        return this.repository.findAll();
    }

    public Page<ATrainingBundleSpecification> findByNameContains(String query, Pageable pageable) {
        return repository.findByNameContains(query, pageable);
    }

    public Page<ATrainingBundleSpecification> findByIsDisabled(boolean disabled, Pageable pageable) {
        return repository.findByIsDisabled(disabled, pageable);
    }

    public boolean existsByName(String name) {
        return repository.existsByName(name);
    }

    public Page<ATrainingBundleSpecification> findByNameAndIsDisabled(String name, Boolean disabled, Pageable pageable) {
        return repository.findByNameAndIsDisabled(name, disabled, pageable);
    }

    public List<ATrainingBundleSpecification> findByIsDisabled(Boolean disabled) {
        return repository.findByIsDisabled(disabled);
    }

    private Page<ATrainingBundleSpecification> initAssociation(Page<ATrainingBundleSpecification> page) {
        return page.map(ATrainingBundleSpecification::eager);
    }
}
