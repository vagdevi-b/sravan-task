package com.osi.activiti.exception;

import java.util.Properties;
import java.util.ResourceBundle;

import javax.mail.Message;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import org.activiti.engine.delegate.DelegateTask;
import org.activiti.engine.delegate.TaskListener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 
 * @author smanchala
 *
 */
public class ErrorEmailListener implements TaskListener{

	private static final long serialVersionUID = -1566545250020846643L;
	
	public static final String ERROR_HANDLER_VARS_TASK_NAME = "task-name";
	public static final String ERROR_HANDLER_VARS_PROCESS_DEF = "process-definition-id";
	public static final String ERROR_HANDLER_VARS_PROCESS_INST_ID = "process-instance-id";
	public static final String ERROR_HANDLER_VARS_ERROR = "error";
	public static final String ERROR_HANLDER_ID = "error-handler";
	public static final String ERROR_HANLDER_ID_FOR_SUB_PROCESS = "subProcessErrorHandler";
	public static final String MAIN_PROCESS_INST_ID = "mainProcessInstanceId";

	private ResourceBundle bundle = ResourceBundle.getBundle("resources");
	private final Logger LOGGER = LoggerFactory.getLogger(getClass());
	
	@Override
	public void notify(DelegateTask delegateTask) {
		
		String to = bundle.getString("error.email.to");		
		String from = bundle.getString("error.email.from");
		String fromName = bundle.getString("error.email.from.name");
		String host = bundle.getString("error.email.host");
		String port = bundle.getString("error.email.port");

		Properties properties = System.getProperties();
		properties.put("mail.smtp.starttls.enable", "true");
		properties.put("mail.smtp.auth", "true");
		properties.setProperty("mail.smtp.host", host);
		properties.setProperty("mail.smtp.port", port);
		properties.setProperty("mailServerUseTLS", "true");

	    Session session = Session.getInstance(properties,
	            new javax.mail.Authenticator() {
	                protected PasswordAuthentication getPasswordAuthentication() {
	                    //return new PasswordAuthentication("emailrestservice@gmail.com", "emailosi");
	                	return new PasswordAuthentication(bundle.getString("error.email.username"), bundle.getString("error.email.password"));
	                }
	            });
		
		//Session session = Session.getDefaultInstance(properties);

		try {
			LOGGER.info("Sending error email for \""+delegateTask.getVariable(ERROR_HANDLER_VARS_TASK_NAME)+"\"");
			String subject = bundle.getString("error.email.subject");
			
			String[] toAddresses = null;
			if(to.length() != 0){
				toAddresses = to.trim().split(",");
			}
			// Create a default MimeMessage object.
			MimeMessage message = new MimeMessage(session);
			message.setFrom(new InternetAddress(from, fromName));
			//message.addRecipient(Message.RecipientType.TO, new InternetAddress(to));
			for(int i = 0; i < toAddresses.length; i++) {
			    if(!toAddresses[i].isEmpty())
			        message.addRecipient(Message.RecipientType.TO, new InternetAddress(toAddresses[i]));
			}
			message.setSubject(subject);
			String emailBody = bundle.getString("error.email.body");
			
			
			String flowName = (String)delegateTask.getVariable(ERROR_HANDLER_VARS_PROCESS_DEF);
			String[] keys = flowName.split(":");
			emailBody = emailBody.replace("{flowName}", keys[0]);
			// Appending error details
			emailBody = emailBody.replace("{"+ERROR_HANDLER_VARS_TASK_NAME+"}", delegateTask.getVariable(ERROR_HANDLER_VARS_TASK_NAME)+"");
			emailBody = emailBody.replace("{"+ERROR_HANDLER_VARS_PROCESS_DEF+"}", delegateTask.getVariable(ERROR_HANDLER_VARS_PROCESS_DEF)+"");
			emailBody = emailBody.replace("{"+MAIN_PROCESS_INST_ID+"}", delegateTask.getVariable(MAIN_PROCESS_INST_ID)+"");
			emailBody = emailBody.replace("{"+ERROR_HANDLER_VARS_PROCESS_INST_ID+"}", delegateTask.getVariable(ERROR_HANDLER_VARS_PROCESS_INST_ID)+"");
			
			emailBody = emailBody.replace("{"+ERROR_HANDLER_VARS_ERROR+"}", delegateTask.getVariable(ERROR_HANDLER_VARS_ERROR)+"");
			message.setContent(emailBody, "text/html");
			
			// Send email
			Transport.send(message);
			LOGGER.info("Error email for \""+delegateTask.getVariable(ERROR_HANDLER_VARS_TASK_NAME)+"\" was sent succesfully");
		} catch(AddressException ex){
			LOGGER.error("Error while getting toAddresses....");
		}catch (Exception e) {
			LOGGER.error("Error while sending email", e);
		}
	}
}
