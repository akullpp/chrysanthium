---
title: 'Java EE: Scheduler'
date: 2014-06-10
category: post
path: /java-ee-scheduler
---

Enterprise newcomers often tend to use unnecessary libraries for simple tasks that are possible without. For many scheduling tasks in web applications, you don't need to use libraries like [Quartz](http://quartz-scheduler.org/). Let's say that you want to send an mail every midnight:

```java
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.annotation.Resource;
import javax.ejb.Schedule;
import javax.ejb.Stateless;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

@Stateless
public class MailService {
    @Resource(name = "mail/defaultMail")
    private Session mailSession;

    @Schedule(hour = "0", dayOfMonth = "*", persistent = false)
    public void scheduleMail() {
        Logger.getLogger(MailService.class.getName()).log(Level.INFO,
                                                          "Sending scheduled e-mail");
        sendMail("example@example.com", "test", "test");
    }

    public void sendMail(String recipient, String subject, String body) {
        try {
            MimeMessage message = new MimeMessage(mailSession);

            message.setRecipient(Message.RecipientType.TO, new InternetAddress(recipient));
            message.setSubject(subject);
            message.setText(body, "utf-8", "html");

            Transport.send(message);
        }
        catch (MessagingException me) {
            Logger.getLogger(MailService.class.getName()).log(Level.SEVERE, null, me);
        }
    }
}
```

Only the `@Schedule` Annotation is required which can even be constructed programmatically. Read more about it in the official [Java EE 7 Timer Service Tutorial](http://docs.oracle.com/javaee/7/tutorial/doc/ejb-basicexamples004.htm).
