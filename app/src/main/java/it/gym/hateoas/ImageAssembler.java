package it.gym.hateoas;

import it.gym.model.Image;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;

public class ImageAssembler extends RepresentationModelAssemblerSupport<Image, ImageResource> {

    public ImageAssembler(){
        super(Image.class, ImageResource.class);
    }

    @Override
    public ImageResource toModel(Image user) {
        ImageResource resource = new ImageResource(user);
        return resource;
    }
}
