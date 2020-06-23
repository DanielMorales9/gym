package it.gym.hateoas;

import com.fasterxml.jackson.annotation.JsonProperty;
import it.gym.model.Customer;
import org.springframework.hateoas.RepresentationModel;

public class CustomerResource extends RepresentationModel<CustomerResource> {

        private final Long id;
        private final String firstName;
        private final String lastName;

        public CustomerResource(Customer customer) {
            this.id = customer.getId();
            this.firstName = customer.getFirstName();
            this.lastName = customer.getLastName();
        }

        @JsonProperty("id")
        public Long getCustomerId() {
            return id;
        }

        public String getFirstName() {
            return firstName;
        }

        public String getLastName() {
            return lastName;
        }
    }
