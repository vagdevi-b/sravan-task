package com.osi.activiti.delegate;

import java.util.List;
import java.util.ListIterator;

import org.activiti.engine.delegate.BpmnError;
import org.activiti.engine.impl.pvm.delegate.ActivityExecution;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import com.osi.activiti.exception.BusinessException;
import com.osi.activiti.exception.DataAccessException;
import com.osi.ems.domain.OsiEmployees;
import com.osi.ems.repository.custom.OsiEmployeesRepositoryCustom;

@Component("skillsetUpdate")
public class GetSkillNotUpdatedEmployees /*extends ActivityBehaviour*/ {
	
	//private static final long serialVersionUID = 1L;
	private Logger LOGGER = LoggerFactory.getLogger(getClass());
	
	@Autowired
	private OsiEmployeesRepositoryCustom employeeRepo;
	
	@Autowired
	private Environment env;
	
	//@Override
	public boolean onExecute(ActivityExecution execution) throws BpmnError {
		LOGGER.info("## GetSkillNotUpdatedEmployees : Begin");
		boolean hasEmployees = false;
		try {
			List<OsiEmployees> notUpdatedEmpList = employeeRepo.getEmployeesNotUpdatedSkills();
			if(notUpdatedEmpList.isEmpty()) {
				//execution.setVariable("hasEmployees", false);
				hasEmployees = false;
			} else {
				StringBuilder emailsList = new StringBuilder();
				ListIterator<OsiEmployees> iterator = notUpdatedEmpList.listIterator();
				while(iterator.hasNext()) {
					emailsList.append(iterator.next().getOfficeEmail().toLowerCase());
					if(iterator.hasNext())
						emailsList.append(",");					
				}
				execution.setVariable("mailList", emailsList.toString());
				execution.setVariable("mailSubject", "Reminder to Update your Skill Set");
				String applicationUrl = env.getProperty("ems.application.url");
				if(applicationUrl.isEmpty() && applicationUrl.equals(null)) 
					throw new BusinessException("ERRR_1006", "(ems.application.url proerty value not found");
				execution.setVariable("mailContent", "Hi,<br/><br/> You have not updated your skill set for 6-months. Please Update Your Skill Set in <a href='"+applicationUrl+"'> OSI ONE </a><br/><br/>Thanks<br/>EMS System");
				//execution.setVariable("hasEmployees", true);
				hasEmployees = true;
			}
		} catch(DataAccessException e) {
			LOGGER.info("Error Occured while executing the GetSkillNotUpdatedEmployees from DB");
			execution.setVariable("processDefId", execution.getProcessDefinitionId());
			execution.setVariable("processInsId", execution.getCurrentActivityName());
			execution.setVariable("error", e.getMessage() + " -- "+e.getSystemMessage());
			
			throw new BpmnError("ERR_1019", "Error Occured while executing the GetSkillNotUpdatedEmployees from DB");
		} catch(Exception e) {
			//throw new BusinessException("ERR_1011", "Error occured while executing the GetSkillNotUpdatedEmployees");
			
			LOGGER.info("Error Occured while executing the GetSkillNotUpdatedEmployees from DB");
			execution.setVariable("processDefId", execution.getProcessDefinitionId());
			execution.setVariable("processInsId", execution.getCurrentActivityName());
			execution.setVariable("error", e.getMessage() + " -- "+e.getLocalizedMessage());
			
			throw new BpmnError("ERR_1019", "Error Occured while executing the GetSkillNotUpdatedEmployees from DB");
		}
		LOGGER.info("## GetSkillNotUpdatedEmployees : End");
		return hasEmployees;
	}

}
