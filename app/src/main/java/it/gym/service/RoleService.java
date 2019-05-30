package it.gym.service;

import it.gym.exception.RoleNotFoundException;
import it.gym.model.Role;
import it.gym.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
@Transactional
public class RoleService implements ICrudService<Role, Long>{

    @Autowired private RoleRepository roleRepository;

    @Override
    public Role save(Role role) {
        return this.roleRepository.save(role);
    }

    @Override
    public Role findById(Long id) {
        return this.roleRepository.findById(id).orElseThrow(RoleNotFoundException::new);
    }

    @Override
    public void delete(Role role) {
        this.roleRepository.delete(role);
    }

    @Override
    public List<Role> findAll() {
        return this.roleRepository.findAll();
    }

    public List<Role> findAllById(List<Long> rolesId) {
        return this.roleRepository.findAllById(rolesId);
    }
}
