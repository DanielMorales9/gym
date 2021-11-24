package it.gym.facade;

import com.fasterxml.jackson.databind.ObjectMapper;
import it.gym.exception.BadRequestException;
import it.gym.exception.NotFoundException;
import it.gym.mappers.UserMapper;
import it.gym.model.AUser;
import it.gym.model.Image;
import it.gym.model.Role;
import it.gym.model.VerificationToken;
import it.gym.pojo.UserDTO;
import it.gym.repository.ImageRepository;
import it.gym.service.UserService;
import it.gym.service.VerificationTokenService;
import it.gym.utility.BlobUtility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.transaction.Transactional;
import java.io.IOException;
import java.util.List;
import java.util.zip.DataFormatException;


@Component
@Transactional
public class UserFacade {

    @Autowired
    @Qualifier("verificationTokenService")
    private VerificationTokenService tokenService;

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private UserService service;

    @Autowired private UserMapper userMapper;

    @Autowired
    private ObjectMapper objectMapper;

    public AUser delete(Long id) {
        AUser user = this.service.findById(id);
        if (tokenService.existsByUser(user)) {
            VerificationToken vtk = this.tokenService.findByUser(user);
            this.tokenService.delete(vtk);
        }

        if (!user.isActive()) {
            this.service.deleteById(id);
        }
        else {
            throw new BadRequestException("Impossibile eliminare un utente con delle transazioni attive");
        }
        return user;
    }

    public AUser findById(Long id) {
        return service.findById(id);
    }

    public AUser save(AUser u) {
        return this.service.save(u);
    }

    public AUser findByEmail(String email) {
        return this.service.findByEmail(email);
    }

    public Page<UserDTO> findByName(String query, Pageable pageable) {
        return service.findByName(query.toLowerCase(), pageable).map(userMapper::toDTO);
    }

    public Page<UserDTO> findAll(Pageable pageable) {
        return service.findAll(pageable).map(userMapper::toDTO);
    }

    public List<AUser> findUserByEventId(Long eventId) {
        return service.findUserEvent(eventId);
    }

    @CacheEvict(value = "profile_pictures", key="#id")
    public AUser uploadImage(Long id, MultipartFile file) throws IOException {
        AUser user = this.service.findById(id);
        Image image1 = user.getImage();
        if (image1 != null) {
            id = image1.getId();
            imageRepository.deleteById(id);
        }

        Image image = new Image(file.getOriginalFilename(), file.getContentType(), BlobUtility.compressBytes(file.getBytes()), user);
        user.setImage(image);
        return this.save(user);
    }

    @CachePut(value = "profile_pictures", key="#id")
    public Image retrieveImage(Long id) throws DataFormatException, IOException {
        AUser user = this.service.findById(id);
        Image image = user.getImage();
        if (image != null) {
            return new Image(image.getName(), image.getType(), BlobUtility.decompressBytes(image.getPicByte()));
        }
        throw new NotFoundException("Immagine assente");
    }


    public List<Role> getUserRolesById(Long id) {
        return findById(id).getRoles();
    }

    public AUser patchUser(Long id, HttpServletRequest request) throws IOException {
        AUser u = findById(id);
        u = objectMapper.readerForUpdating(u).readValue(request.getReader());
        return save(u);
    }

}
