package it.gym.hateoas;

import it.gym.model.Image;
import org.springframework.hateoas.mvc.ResourceAssemblerSupport;

public class ImageAssembler extends ResourceAssemblerSupport<Image, ImageResource> {

    public ImageAssembler(){
        super(Image.class, ImageResource.class);
    }

    @Override
    public ImageResource toResource(Image user) {
        ImageResource resource = new ImageResource(user);
        return resource;
    }
}
