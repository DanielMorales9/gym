package it.gym.hateoas;

import it.gym.model.Sale;
import lombok.Data;
import org.springframework.hateoas.Resources;

public class SaleResource extends ResourceModel<Sale> {

    SaleResource(Sale model) {
        super(model);
    }

}
