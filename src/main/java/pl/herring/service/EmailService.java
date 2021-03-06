package pl.herring.service;

import com.sun.mail.smtp.SMTPTransport;
import org.springframework.stereotype.Service;
import pl.herring.model.User;
import pl.herring.repository.UserRepository;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.Date;
import java.util.Properties;

import static javax.mail.Message.RecipientType.*;
import static pl.herring.constant.EmailConstant.*;

@Service
public class EmailService {

    private UserRepository userRepository;

    public EmailService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void sendPasswordEmail(String firstName, String password, String email) throws MessagingException {
        Message message = createEmail(firstName, password, email);
        SMTPTransport smtpTransport = (SMTPTransport) getEmailSession().getTransport(SIMPLE_EMAIL_TRANSFER_PROTOCOL);
        smtpTransport.connect(GMAIL_SMTP_SERVER, USERNAME, PASSWORD);
        smtpTransport.sendMessage(message, message.getAllRecipients());
        smtpTransport.close();
    }


    public void sendInformationAddedToProject(String username, String title) throws MessagingException {
        Message message = new MimeMessage(getEmailSession());
        message.setFrom(new InternetAddress(FROM_EMAIL));
        message.setRecipients(TO, InternetAddress.parse(userRepository.findByUsername(username).getEmail(), false));
        message.setRecipients(CC, InternetAddress.parse(CC_EMAIL, false));
        message.setSubject(EMAIL_SUBJECT_ADDED);
        message.setText("Hello " + userRepository.findByUsername(username).getFirstName() + ", \n \n You have been added to project: " + title + ".\n \n The Support Team");
        message.setSentDate(new Date());
        message.saveChanges();
        SMTPTransport smtpTransport = (SMTPTransport) getEmailSession().getTransport(SIMPLE_EMAIL_TRANSFER_PROTOCOL);
        smtpTransport.connect(GMAIL_SMTP_SERVER, USERNAME, PASSWORD);
        smtpTransport.sendMessage(message, message.getAllRecipients());
        smtpTransport.close();
    }


    public void sendInformationDeletedFromProject(String username, String title) throws MessagingException {
        Message message = new MimeMessage(getEmailSession());
        message.setFrom(new InternetAddress(FROM_EMAIL));
        message.setRecipients(TO, InternetAddress.parse(userRepository.findByUsername(username).getEmail(), false));
        message.setRecipients(CC, InternetAddress.parse(CC_EMAIL, false));
        message.setSubject(EMAIL_SUBJECT_REMOVED);
        message.setText("Hello " + userRepository.findByUsername(username).getFirstName() + ", \n \n You have been removed from project: " + title + ".\n \n The Support Team");
        message.setSentDate(new Date());
        message.saveChanges();
        SMTPTransport smtpTransport = (SMTPTransport) getEmailSession().getTransport(SIMPLE_EMAIL_TRANSFER_PROTOCOL);
        smtpTransport.connect(GMAIL_SMTP_SERVER, USERNAME, PASSWORD);
        smtpTransport.sendMessage(message, message.getAllRecipients());
        smtpTransport.close();
    }

    private Message createEmail(String firstName, String password, String email) throws MessagingException {
        Message message = new MimeMessage(getEmailSession());
        message.setFrom(new InternetAddress(FROM_EMAIL));
        message.setRecipients(TO, InternetAddress.parse(email, false));
        message.setRecipients(CC, InternetAddress.parse(CC_EMAIL, false));
        message.setSubject(EMAIL_SUBJECT);
        message.setText("Hello " + firstName + ", \n \n Your new account password is: " + password + "\n \n The Support Team");
        message.setSentDate(new Date());
        message.saveChanges();
        return message;
    }

    private Session getEmailSession() {
        Properties properties = System.getProperties();
        properties.put(SMTP_HOST, GMAIL_SMTP_SERVER);
        properties.put(SMTP_AUTH, true);
        properties.put(SMTP_PORT, DEFAULT_PORT);
        properties.put(SMTP_STARTTLS_ENABLE, true);
        properties.put(SMTP_STARTTLS_REQUIRED, true);
        return Session.getInstance(properties, null);
    }
}
