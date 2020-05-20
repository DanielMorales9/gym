package it.gym.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import it.gym.hateoas.GymAssembler;
import it.gym.hateoas.GymResource;
import it.gym.model.Gym;
import it.gym.pojo.Icon;
import it.gym.pojo.Manifest;
import it.gym.service.GymService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/gyms")
public class GymController {

    private Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    private GymService service;

    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<GymResource> findGymById(@PathVariable Long id) {
        Gym gym = service.findById(id);
        return ResponseEntity.ok(new GymAssembler().toResource(gym));
    }

    @GetMapping
    public ResponseEntity<List<GymResource>> findGyms() {
        List<Gym> gym = service.findAll();
        return ResponseEntity.ok(new GymAssembler().toResources(gym));
    }

    @GetMapping("/manifest.webmanifest")
    @ResponseBody
    public Manifest getManifest() {
        Gym gym = service.findAll().get(0);

        Manifest manifest = new Manifest();
        manifest.setName(gym.getFullName());
        manifest.setShort_name(gym.getName());
        manifest.setTheme_color(gym.getThemeColor());
        manifest.setBackground_color(gym.getBackgroundColor());

        ArrayList<Icon> icons = new ArrayList<>();
        Icon icon0 = new Icon("/src/assets/icons/android-chrome-192x192.png", "192x192", "image/png");
        Icon icon1 = new Icon("/src/assets/icons/android-chrome-512x512.png", "512x512", "image/png");
        Icon icon2 = new Icon("/src/assets/icons/favicon-16x16.png", "16x16", "image/png");
        Icon icon3 = new Icon("/src/assets/icons/favicon-32x32.png", "32x32", "image/png");
        icons.add(icon0);
        icons.add(icon1);
        icons.add(icon2);
        icons.add(icon3);

        manifest.setIcons(icons);
        logger.info(manifest.toString());
        return manifest;
    }

    @PatchMapping(path = "/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<GymResource> patch(@PathVariable Long id, HttpServletRequest request) throws IOException {
        Gym gym = service.findById(id);
        gym = objectMapper.readerForUpdating(gym).readValue(request.getReader());
        gym = service.save(gym);
        return ResponseEntity.ok(new GymAssembler().toResource(gym));
    }
}
