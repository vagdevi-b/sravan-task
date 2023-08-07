package com.osi.activiti.delegate;

import org.activiti.engine.delegate.BpmnError;
import org.activiti.engine.impl.pvm.delegate.ActivityExecution;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.osi.activiti.exception.BusinessException;
import com.osi.ems.domain.OsiEmailContents;
import com.osi.ems.domain.OsiEmployees;
import com.osi.ems.repository.IOsiEmailContentsRepo;

@Component("prepareMailProbation")
public class PrepareMailContentForProbation /*extends ActivityBehaviour */{
	
	private Logger LOGGER = LoggerFactory.getLogger(getClass());
	
	/*@Autowired
	private IOsiWFActivitiesRepository wfsActivitiesRepo;*/
	
	@Autowired
	private IOsiEmailContentsRepo emailContents;
	
	//@Override
	public OsiEmailContents onExecute(ActivityExecution execution) throws BusinessException {
		//StringBuilder sb = new StringBuilder();
		OsiEmailContents mailContent = null;
		LOGGER.info(" ## PrepareMailContentForProbation : Begin");
		try {
				
				OsiEmployees employee = (OsiEmployees) execution.getVariable("employee");
				if(employee.equals(null)) {
					throw new BusinessException("ERR_1010", "Employee Object is NULL in PrepareContentForModifiedFields");
				}else {
					
					/*mailContent = emailContents.findByContentNameAndOrgId("Employee_Probation_Supervisor", employee.getOrgId());
					if( mailContent.getContentSubject() == null || mailContent.getContentBody() == null) {
						throw new BusinessException("ERR_1010", "Mail Subject/Body is NULL in PrepareMailContentForEmpCreationProcess");
					}*/
				}
			} catch(Exception e) {
				//throw new BusinessException("ERR_1009", "Exception occured while executing PrepareContentForModifiedFields");
				
				LOGGER.info("Error Occured while executing the CheckForModificationsFields from DB");
				execution.setVariable("processDefId", execution.getProcessDefinitionId());
				execution.setVariable("processInsId", execution.getCurrentActivityName());
				execution.setVariable("error", e.getMessage() + " -- Error Occured while executing the PrepareMailContentForProbation from DB");
				
				throw new BpmnError("ERR_1019", "Error Occured while executing the PrepareMailContentForProbation from DB");
			}
		LOGGER.info(" ## PrepareMailContentForProbation : End");
		return mailContent;
	}

}
