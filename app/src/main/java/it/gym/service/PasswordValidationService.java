package it.gym.service;

import com.google.common.base.Joiner;
import it.gym.exception.InvalidPasswordException;
import org.passay.*;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Service
public class PasswordValidationService {

    private final PasswordValidator validator;

    public PasswordValidationService(){
        this.validator = new PasswordValidator(Arrays.asList(
                new LengthRule(8, 30),
                /*
                new UppercaseCharacterRule(1),
                new DigitCharacterRule(1),
                new SpecialCharacterRule(1),

                new NumericalSequenceRule(3,false),
                new AlphabeticalSequenceRule(3,false),
                new QwertySequenceRule(3,false),
                */
                new WhitespaceRule())
        );
    }

    public void validate(String password) {
        RuleResult res = validator.validate(new PasswordData(password));
        if (!res.isValid()) {
            String message = Joiner.on(" ").join(validator.getMessages(res));
            throw new InvalidPasswordException(message);
        }
    }
}
