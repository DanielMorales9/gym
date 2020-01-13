package it.gym.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import it.gym.hateoas.GymAssembler;
import it.gym.hateoas.GymResource;
import it.gym.model.Gym;
import it.gym.service.GymService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/gyms")
public class GymController {

    @Autowired
    private GymService service;
    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping("/{id}")
    ResponseEntity<GymResource> findGymById(@PathVariable Long id) {
        Gym gym = service.findById(id);
        return ResponseEntity.ok(new GymAssembler().toResource(gym));
    }

    @GetMapping
    ResponseEntity<List<GymResource>> findGyms() {
        List<Gym> gym = service.findAll();
        return ResponseEntity.ok(new GymAssembler().toResources(gym));
    }

    @PatchMapping(path = "/{id}")
    ResponseEntity<GymResource> patch(@PathVariable Long id, HttpServletRequest request) throws IOException {
        Gym gym = service.findById(id);
        gym = objectMapper.readerForUpdating(gym).readValue(request.getReader());
        gym = service.save(gym);
        return ResponseEntity.ok(new GymAssembler().toResource(gym));
    }
}
