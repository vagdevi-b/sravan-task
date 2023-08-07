package com.osi.activiti.delegate;

import java.util.List;
import java.util.stream.Collectors;

import org.activiti.engine.delegate.BpmnError;
import org.activiti.engine.impl.pvm.delegate.ActivityExecution;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import com.osi.activiti.exception.BusinessException;
import com.osi.activiti.exception.DataAccessException;
import com.osi.ems.domain.OsiEmpSkills;
import com.osi.ems.domain.OsiEmployees;
import com.osi.ems.domain.OsiWFActivities;
import com.osi.ems.repository.IOsiWFActivitiesRepository;
import com.osi.ems.repository.custom.impl.OsiEmpSkillsRepoImpl;

@Component("skillDetails")
public class SkillDetailsDelegate /*extends ActivityBehaviour*/ {

	//private static final long serialVersionUID = 1L;
	
	private final Logger LOGGER = LoggerFactory.getLogger(getClass());
	
	@Autowired
	private Environment env;
	
	@Autowired
	private OsiEmpSkillsRepoImpl empSkillsRepo;
	
	@Autowired
	private IOsiWFActivitiesRepository wfsActivitiesRepo;
	
	@Value("${ems.wf.activities.flag.initial.process}")
	String initialProcessFlag;
	@Value("${ems.wf.activities.flag.after.process}")
	String afterProcessFlag;
	
	//@Override
	public String onExecute(ActivityExecution execution) throws BpmnError {
		LOGGER.info("## -- SkillDetailsDelegate: Begin");
		String unVerifiedSkillsList = null;
		try {
			OsiEmployees employee = (OsiEmployees) execution.getVariable("employee");
			if(!employee.equals(null)) {
				List<OsiEmpSkills> unVerifiedSkills = empSkillsRepo.getUnverifiedSkills(employee.getEmployeeId());
				
				unVerifiedSkillsList = unVerifiedSkills.stream().map(obj-> obj.getSkillName()).collect(Collectors.joining("<br/>"));
				if(unVerifiedSkills.isEmpty())
					execution.setVariable("haveSkills", false);
				else
					execution.setVariable("haveSkills", true);
				//execution.setVariable("unVerifiedSkills", unVerifiedSkills);
				
				String objectName = env.getProperty("ems.notification.object.skill.name");
				String applicationUrl = env.getProperty("ems.application.url");
				if(!objectName.isEmpty() && !objectName.equals(null)) { 
					execution.setVariable("ObjectName", objectName);
				} else {
					throw new BusinessException("ERRR_1006", "(ems.notification.object.skill.name proerty value not found");
				}
				if(!applicationUrl.isEmpty() && !applicationUrl.equals(null)) {
					execution.setVariable("applicationUrl", applicationUrl);
				} else {
					throw new BusinessException("ERRR_1006", "(ems.application.url proerty value not found");
				}
				LOGGER.info(""+unVerifiedSkills.toString());
			} else {
				throw new BusinessException("ERR_1006", "Invalid Employee supplied for get Employee Skills");
			}
		} catch (DataAccessException e) {
			LOGGER.info("Error Occured while executing the SkillDetailsDelegate from DB");
			execution.setVariable("processDefId", execution.getProcessDefinitionId());
			execution.setVariable("processInsId", execution.getCurrentActivityName());
			execution.setVariable("error", e.getMessage() + " -- "+e.getSystemMessage());
			
			throw new BpmnError("ERR_1019", e.getSystemMessage());
		} catch (BusinessException e) {
			LOGGER.info("Error Occured while executing the SkillDetailsDelegate from DB");
			execution.setVariable("processDefId", execution.getProcessDefinitionId());
			execution.setVariable("processInsId", execution.getCurrentActivityName());
			execution.setVariable("error", e.getMessage() + " -- "+e.getSystemMessage());
			
			throw new BpmnError("ERR_1019", e.getSystemMessage());
		} catch (Exception e) {
			//throw new BusinessException("ERR_1002", e.getMessage());
			
			LOGGER.info("Error Occured while executing the SkillDetailsDelegate from DB");
			execution.setVariable("processDefId", execution.getProcessDefinitionId());
			execution.setVariable("processInsId", execution.getCurrentActivityName());
			execution.setVariable("error", e.getMessage() + " -- Error Occured while executing the SkillDetailsDelegate from DB");
			
			/**
			 * Rollback to 'N' state in osi_wf_activities table
			 */
			if(!execution.getCurrentActivityName().equalsIgnoreCase("Get Email Config List For Probation")) {
				OsiWFActivities wfRecord = (OsiWFActivities) execution.getVariable("wfRecord");
				if(wfsActivitiesRepo.findOne(wfRecord.getActivityId()).getProcessFlag().equalsIgnoreCase(afterProcessFlag)) {
					wfRecord.setProcessFlag(initialProcessFlag);
					wfsActivitiesRepo.save(wfRecord);
				}
			}
			throw new BpmnError("ERR_1019", "Error Occured while executing the SkillDetailsDelegate from DB");
		}
		LOGGER.info("## -- SkillDetailsDelegate : End");
		return unVerifiedSkillsList;
	}

}
