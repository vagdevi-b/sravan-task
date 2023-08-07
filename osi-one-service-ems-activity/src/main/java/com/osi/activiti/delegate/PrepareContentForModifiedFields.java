package com.osi.activiti.delegate;

import java.util.Map;

import org.activiti.engine.delegate.BpmnError;
import org.activiti.engine.impl.pvm.delegate.ActivityExecution;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.osi.activiti.exception.BusinessException;
import com.osi.ems.domain.OsiEmailContents;
import com.osi.ems.domain.OsiEmployees;
import com.osi.ems.domain.OsiWFActivities;
import com.osi.ems.repository.IOsiEmailContentsRepo;
import com.osi.ems.repository.IOsiWFActivitiesRepository;

@Component("prepareMail")
public class PrepareContentForModifiedFields /*extends ActivityBehaviour */{
	
	private Logger LOGGER = LoggerFactory.getLogger(getClass());
	
	@Autowired
	private IOsiWFActivitiesRepository wfsActivitiesRepo;
	
	@Autowired
	private IOsiEmailContentsRepo emailContents;
	
	@Value("${ems.wf.activities.flag.initial.process}")
	String initialProcessFlag;
	@Value("${ems.wf.activities.flag.after.process}")
	String afterProcessFlag;
	
	//@Override
	public OsiEmailContents onExecute(ActivityExecution execution) throws BusinessException {
		StringBuilder sb = new StringBuilder();
		OsiEmailContents mailContent = new OsiEmailContents();
		LOGGER.info(" ## PrepareContentForModifiedFields : Begin");
		try {
				@SuppressWarnings("unchecked")
				Map<String, String> modifiedFields = (Map<String, String>) execution.getVariable("modifiedFields");
				OsiEmployees employee = (OsiEmployees) execution.getVariable("employee");
				if(modifiedFields.isEmpty() && employee.equals(null)) {
					throw new BusinessException("ERR_1010", "Employee Object is NULL in PrepareContentForModifiedFields");
				}else {
					
					mailContent = emailContents.findByContentNameAndOrgId("Update_Employee", employee.getOrgId());
					if( mailContent.getContentSubject() == null) {
						mailContent.setContentSubject("Update Employee");
						//throw new BusinessException("ERR_1010", "Mail Subject/Body is NULL in PrepareMailContentForEmpCreationProcess");
					}
					sb.append("<table style='width:80%;font-family: arial, sans-serif;border-collapse: collapse;margin-left:50px;'>");
					sb.append("<tr>");
					sb.append("<th style='border: 1px solid #dddddd;text-align:left;padding:8px;'>Employee Number</th>");
					sb.append("<td style='border: 1px solid #dddddd;text-align:left;padding:8px;'>"+employee.getEmployeeNumber()+"</td>"); 
					sb.append("</tr>");
					sb.append("<tr>");
					sb.append("<th style='border: 1px solid #dddddd;text-align:left;padding:8px;'>Employee Name</th>");
					sb.append("<td style='border: 1px solid #dddddd;text-align:left;padding:8px;'>"+employee.getFullName()+"</td>"); 
					sb.append("</tr>");
					modifiedFields.forEach((k, v) -> {
						sb.append("<tr>");
						sb.append("<th style='border: 1px solid #dddddd;text-align:left;padding:8px;'>"+k.toUpperCase()+"</th>");
						sb.append("<td style='border: 1px solid #dddddd;text-align:left;padding:8px;'>"+v+"</td>"); 
						sb.append("</tr>");
					});
					sb.append("</table><br/><br/>");
					mailContent.setContentBody(sb.toString());
				}
			} catch(Exception e) {
				//throw new BusinessException("ERR_1009", "Exception occured while executing PrepareContentForModifiedFields");

				LOGGER.info("Error Occured while executing the CheckForModificationsFields from DB");
				execution.setVariable("processDefId", execution.getProcessDefinitionId());
				execution.setVariable("processInsId", execution.getCurrentActivityName());
				execution.setVariable("error", e.getMessage() + " -- Error Occured while executing the CheckForModificationsFields from DB");
				
				/**
				 * Rollback to 'N' state in osi_wf_activities table
				 */
				OsiWFActivities wfRecord = (OsiWFActivities) execution.getVariable("wfRecord");
				if(wfsActivitiesRepo.findOne(wfRecord.getActivityId()).getProcessFlag().equalsIgnoreCase(afterProcessFlag)) {
					wfRecord.setProcessFlag(initialProcessFlag);
					wfsActivitiesRepo.save(wfRecord);
				}
				throw new BpmnError("ERR_1019", "Error Occured while executing the CheckForModificationsFields from DB");
			}
		LOGGER.info(" ## PrepareContentForModifiedFields : End");
		return mailContent;
	}

}
