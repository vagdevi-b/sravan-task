package com.osi.activiti.delegate;

import org.activiti.engine.delegate.BpmnError;
import org.activiti.engine.impl.pvm.delegate.ActivityExecution;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.osi.activiti.exception.BusinessException;
import com.osi.ems.domain.ConfigMails;
import com.osi.ems.domain.OsiEmailContents;
import com.osi.ems.domain.OsiEmployees;

@Component("prepareMailContentForEmpCreation")
public class PrepareMailContentForEmpCreationProcess {
	
	private Logger LOGGER = LoggerFactory.getLogger(getClass());
	
	/*@Autowired
	private IOsiEmailContentsRepo emailContents;*/
	
	public OsiEmailContents onExecute(ActivityExecution execution) throws BpmnError {
		LOGGER.info(" ## PrepareMailContentForEmpCreationProcess : Begin");
		//StringBuilder mailContent = new StringBuilder();
		OsiEmailContents mailContent = null;
		try {
			OsiEmployees employeeObj = (OsiEmployees) execution.getVariable("employee");
			if(employeeObj == null)
				throw new BusinessException("ERR_1010", "Employee Object is NULL in PrepareMailContentForEmpCreationProcess");
			
			/*mailContent = emailContents.findByContentNameAndOrgId("New_Employee_HR_DL", employeeObj.getOrgId());
			if( mailContent.getContentSubject() == null || mailContent.getContentBody() == null) {
				throw new BusinessException("ERR_1010", "Mail Subject/Body is NULL in PrepareMailContentForEmpCreationProcess");
			}
			mailContent.setContentSubject(mailContent.getContentSubject());*/
			mailContent = new OsiEmailContents();
			String empCreationSubject = "New Employee - "+employeeObj.getFirstName() + " "+ employeeObj.getLastName() + " ("+employeeObj.getEmployeeNumber()+")";
			execution.setVariable("empCreationSubject", empCreationSubject);
			ConfigMails cfgMails = (ConfigMails)execution.getVariable("configDetails");
			String[] dlLists = cfgMails.getDlLists();
			StringBuilder optionsBuilder = new StringBuilder();
			optionsBuilder.append("<select name='dlList' multiple>");
			for(String dl: dlLists) {
				optionsBuilder.append("<option value='"+dl+"'>"+dl+"</option>");
			}
			optionsBuilder.append("</select>");
			//System.out.println("********************   "+optionsBuilder.toString());
			execution.setVariable("dloptions", optionsBuilder.toString());
			mailContent.setContentSubject(empCreationSubject);
			
		} catch (Exception e) {
			LOGGER.info(" Error While executing the Error While executing the prepareMailContentForEmpCreation service task ");
			execution.setVariable("processDefId", execution.getProcessDefinitionId());
			execution.setVariable("processInsId", execution.getCurrentActivityName());
			execution.setVariable("error", e.getMessage() + " -- Error While executing the prepareMailContentForEmpCreation service task");
			throw new BpmnError("Err_1020", "Error While executing the prepareMailContentForEmpCreation service task");
		}
		LOGGER.info(" ## PrepareMailContentForEmpCreationProcess : End");
		return mailContent;
	}
}
