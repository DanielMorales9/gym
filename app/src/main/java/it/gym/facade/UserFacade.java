package it.gym.facade;

import it.gym.exception.BadRequestException;
import it.gym.exception.NotFoundException;
import it.gym.model.AUser;
import it.gym.model.Image;
import it.gym.model.VerificationToken;
import it.gym.repository.ImageRepository;
import it.gym.service.UserService;
import it.gym.service.VerificationTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.zip.DataFormatException;
import java.util.zip.Deflater;
import java.util.zip.Inflater;


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

    public Page<AUser> findByName(String query, Pageable pageable) {
        query = query.toLowerCase();
        return service.findByName(query, pageable);
    }

    public Page<AUser> findAll(Pageable pageable) {
        return service.findAll(pageable);
    }

    public List<AUser> findUserByEventId(Long eventId) {
        return service.findUserEvent(eventId);
    }

    @CacheEvict(value = "profile_pictures", key="#id")
    public AUser uploadImage(Long id, MultipartFile file) throws IOException {
        AUser user = this.findById(id);
        Image image1 = user.getImage();
        if (image1 != null) {
            id = image1.getId();
            imageRepository.deleteById(id);
        }

        Image image = new Image(file.getOriginalFilename(), file.getContentType(), compressBytes(file.getBytes()), user);
        user.setImage(image);
        return this.save(user);
    }

    @CachePut(value = "profile_pictures", key="#id")
    public Image retrieveImage(Long id) throws DataFormatException, IOException {
        AUser user = this.findById(id);
        Image image = user.getImage();
        if (image != null) {
            return new Image(image.getName(), image.getType(), decompressBytes(image.getPicByte()));
        }
        throw new NotFoundException("Immagine assente");
    }

    public static byte[] decompressBytes(byte[] data) throws DataFormatException, IOException {
        Inflater inflater = new Inflater();
        inflater.setInput(data);
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream(data.length);
        byte[] buffer = new byte[1024];
        while (!inflater.finished()) {
            int count = inflater.inflate(buffer);
            outputStream.write(buffer, 0, count);
        }
        outputStream.close();
        return outputStream.toByteArray();
    }

    public static byte[] compressBytes(byte[] data) throws IOException {
        Deflater deflater = new Deflater();
        deflater.setInput(data);
        deflater.finish();
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream(data.length);
        byte[] buffer = new byte[1024];
        while (!deflater.finished()) {
            int count = deflater.deflate(buffer);
            outputStream.write(buffer, 0, count);
        }
        outputStream.close();
        System.out.println("Compressed Image Byte Size - " + outputStream.toByteArray().length);
        return outputStream.toByteArray();
    }


}
