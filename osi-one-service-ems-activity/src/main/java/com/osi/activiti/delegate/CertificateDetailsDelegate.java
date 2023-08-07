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
import com.osi.ems.domain.OsiEmpCertifications;
import com.osi.ems.domain.OsiEmployees;
import com.osi.ems.domain.OsiWFActivities;
import com.osi.ems.service.ICertificationsService;
import com.osi.ems.service.WfActivitiesService;

@Component("certficateDetails")
public class CertificateDetailsDelegate /*extends ActivityBehaviour*/ {

	private final Logger LOGGER = LoggerFactory.getLogger(getClass());
	
	@Autowired
	private Environment env;
	
	@Autowired
	private ICertificationsService certificationsService;
	
	@Autowired
	private WfActivitiesService wfActivitiesService;
	
	@Value("${ems.wf.activities.flag.initial.process}")
	String initialProcessFlag;
	@Value("${ems.wf.activities.flag.after.process}")
	String afterProcessFlag;
	
	//@Override
	public String onExecute(ActivityExecution execution) throws BpmnError {
		LOGGER.info("## -- CertificateDetailsDelegate: Begin");
		String unVerifiedCertificationsList = null;
		boolean isExceptionOccured = false;
		try {
			OsiEmployees employee = (OsiEmployees) execution.getVariable("employee");
			if(!employee.equals(null)) {
				List<OsiEmpCertifications> unVerifiedCertifications = certificationsService.getUnverifiedCertifications(employee.getEmployeeId());
				unVerifiedCertificationsList = unVerifiedCertifications.stream().map(obj-> obj.getCertificationName()).collect(Collectors.joining("<br/>"));
				//execution.setVariable("unVerifiedCertifications", unVerifiedCertifications);
				if(unVerifiedCertifications.isEmpty())
					execution.setVariable("haveCertifications", false);
				else
					execution.setVariable("haveCertifications", true);
				
				String objectName = env.getProperty("ems.notification.object.certification.name");
				String applicationUrl = env.getProperty("ems.application.url");
				if(!objectName.isEmpty() && !objectName.equals(null)) { 
					execution.setVariable("ObjectName", objectName);
				} else {
					throw new BusinessException("ERR_1018", "(ems.notification.object.certification.name proerty value not found");
				}
				if(!applicationUrl.isEmpty() && !applicationUrl.equals(null)) {
					execution.setVariable("applicationUrl", applicationUrl);
				} else {
					throw new BusinessException("ERRR_1006", "(ems.application.url proerty value not found");
				}
			} else {
				throw new BusinessException("ERR_1010", "Invalid Employee supplied for get Employee Certificates");
			}
		} catch (BusinessException e) {
			isExceptionOccured = true;
			LOGGER.info("Error Occured while executing the CertificateDetailsDelegate");
			execution.setVariable("processDefId", execution.getProcessDefinitionId());
			execution.setVariable("processInsId", execution.getCurrentActivityName());
			execution.setVariable("error", e.getMessage() + " -- "+e.getSystemMessage());
			
			throw new BpmnError(e.getErrorCode(), e.getSystemMessage());
		} catch (Exception e) {
			isExceptionOccured = true;
			LOGGER.info("Error Occured while executing the CertificateDetailsDelegate from DB");
			execution.setVariable("processDefId", execution.getProcessDefinitionId());
			execution.setVariable("processInsId", execution.getCurrentActivityName());
			execution.setVariable("error", e.getMessage() + " -- "+e.getLocalizedMessage());
			
			throw new BpmnError("ERR_1000", "Error Occured while executing the CertificateDetailsDelegate");
		} finally {
			/**
			 * Rollback to 'N' state in osi_wf_activities table
			 */
			if(isExceptionOccured) {
				if(!execution.getCurrentActivityName().equalsIgnoreCase("Get Email Config List For Probation")) {
					try {
						OsiWFActivities wfRecord = (OsiWFActivities) execution.getVariable("wfRecord");
						if(wfActivitiesService.findById(wfRecord.getActivityId()).getProcessFlag().equalsIgnoreCase(afterProcessFlag)) {
							wfRecord.setProcessFlag(initialProcessFlag);
							wfActivitiesService.saveWfRecord(wfRecord);
						}
					} catch(BusinessException e) {
						LOGGER.info("Error Occured while executing the CertificateDetailsDelegate");
						execution.setVariable("processDefId", execution.getProcessDefinitionId());
						execution.setVariable("processInsId", execution.getCurrentActivityName());
						execution.setVariable("error", e.getMessage() + " -- "+e.getSystemMessage());
						throw new BpmnError(e.getErrorCode(), e.getSystemMessage());
					}
				}
			}
		}
		LOGGER.info("## -- CertificateDetailsDelegate : End");
		return unVerifiedCertificationsList;
	}

}
