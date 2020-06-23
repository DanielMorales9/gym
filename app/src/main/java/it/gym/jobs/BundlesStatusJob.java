package it.gym.jobs;

import it.gym.facade.TrainingBundleFacade;
import it.gym.model.ATrainingBundle;
import it.gym.model.AUser;
import it.gym.service.MailService;
import it.gym.service.UserService;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class BundlesStatusJob {

    @Autowired
    private TrainingBundleFacade facade;

    @Autowired
    private UserService userService;

    @Autowired
    @Qualifier("mailService")
    private MailService mailService;

    @Scheduled(cron = "0 30 13 * * ?", zone ="GMT+2:00")
    public void getBundleStatus() {
        List<AUser> admins = userService.findAllAdmins();
        List<ATrainingBundle> expired = facade.getExpiredBundles();
        List<ATrainingBundle> activeBundles = facade.getActiveBundles();

        List<ATrainingBundle> aboutToExpire = activeBundles.stream()
                .filter(p -> p.percentageStatus() >= 90.0)
                .collect(Collectors.toList());

        String subject = "Stato dei pacchetti";
        String body = makeBodyMessage(expired, aboutToExpire);

        admins.forEach(a -> {
            String header = String.format("Gentile %s %s,\n\n", a.getFirstName(), a.getLastName());
            mailService.sendSimpleMail(a.getEmail(), subject, header + body);
        });

    }

    @NotNull
    private String makeBodyMessage(List<ATrainingBundle> expired, List<ATrainingBundle> aboutToExpire) {
        StringBuilder body = new StringBuilder();

        formatBundleMessage(expired, body, "Nessun pacchetto è terminato recentemente.\n\n", "I seguenti pacchetti sono terminati:\n");
        body.append("\n");
        formatBundleMessage(aboutToExpire, body, "Nessun pacchetto sta per terminare\n\n", "I seguenti pacchetti sono in terminazione:\n");

        return body.toString();
    }

    private void formatBundleMessage(List<ATrainingBundle> aboutToExpire, StringBuilder body, String s, String s2) {
        if (aboutToExpire.isEmpty()) {
            body.append(s);
        } else {
            body.append(s2);
            bundlesFormat(aboutToExpire, body);
        }
    }

    private void bundlesFormat(List<ATrainingBundle> expired, StringBuilder body) {
        for (ATrainingBundle aTrainingBundle : expired) {
            body.append(String.format("Pacchetto: %s, Opzione %s, %f, Cliente %s %s\n",
                    aTrainingBundle.getName(),
                    aTrainingBundle.getOption().getName(),
                    aTrainingBundle.getOption().getPrice(),
                    aTrainingBundle.getCustomer().getFirstName(),
                    aTrainingBundle.getCustomer().getLastName()));
        }
    }


}
