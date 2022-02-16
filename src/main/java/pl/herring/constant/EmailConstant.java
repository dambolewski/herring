package pl.herring.constant;

public class EmailConstant {
    public static final String SIMPLE_EMAIL_TRANSFER_PROTOCOL = "smtps";
    public static final String USERNAME = "media.herring@gmail.com";  //email from gmail - sender
    public static final String PASSWORD = "Herring.Media123!";  //password to that account
    public static final String FROM_EMAIL = "support@herring.com";
    public static final String CC_EMAIL = "";
    public static final String EMAIL_SUBJECT = "Herring, LLC - New Password";
    public static final String EMAIL_SUBJECT_ADDED = "Herring, LLC - Welcome in new project";
    public static final String EMAIL_SUBJECT_REMOVED = "Herring, LLC - Removed from project";
    public static final String GMAIL_SMTP_SERVER = "smtp.gmail.com";
    public static final String SMTP_HOST = "mail.smtp.host";
    public static final String SMTP_AUTH = "mail.smtp.auth";
    public static final String SMTP_PORT = "mail.smtp.port";
    public static final int DEFAULT_PORT = 465;
    public static final String SMTP_STARTTLS_ENABLE = "mail.smtp.starttls.enable";
    public static final String SMTP_STARTTLS_REQUIRED = "mail.smtp.starttls.required";
    public static final String EMAIL_WITH_NEW_PASSWORD_SENT = "An email with a new password was sent to: ";
}
