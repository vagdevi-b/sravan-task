package com.osi.activiti.scheduler;

import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;

import com.osi.activiti.exception.BusinessException;
import com.osi.ems.service.IHistoryCleanupService;

/**
 * EMS Scheduler Service
 * @author smanchala
 *
 */
//@Service
public class SchedulerService {
	
	private final Logger LOGGER = LoggerFactory.getLogger(SchedulerService.class);
	
	/*@Autowired
	EMSRuntimeService processRestClient;*/
	
	@Autowired
	EMSRuntimeServiceForExplorer runtimeService;
	
	@Autowired
	IHistoryCleanupService histService;
	
	@Value("${scheduling.job.cron.enabled}")
	String isenabledprjob ; 
	
	@Value("${workflow.key}")
	String workflow_key ;
	
	@Value("${server.type}")
	String serverType;
	
	// Probation Process Job Config
	@Value("${scheduling.job.cron.enabled.probation}")
	String isenabledprobjob ;
	@Value("${workflow.key.probation}")
	String workflow_key_prob ;
	
	// Probation Process Job Config
	@Value("${scheduling.job.cron.enabled.skill.remainder}")
	String isenabledSkillRemainderjob ;
	@Value("${workflow.key.skill.remainder}")
	String workflow_key_skill_remainder ;
	
	@Value("${scheduling.cron.expression.history.enabled}")
	String isenabledHistoryDeleteJob;
	
	@Scheduled(cron = "${scheduling.cron.expression}")
    public void cronPRTask(){
		LOGGER.info(new Date() + "%%%%%%%%%%  ***** set Scheduler Service configuration   ******* %%%%%%%%%%");      
		if (isenabledprjob.equalsIgnoreCase("1")) {
        try {
        	LOGGER.info("###########  SCHEDULE STARTS - WORK FLOW : Parent EMS Process ###########");
        	LOGGER.info(serverType);
        	if(!serverType.trim().isEmpty() && serverType.equalsIgnoreCase("explorer")) {
        		runtimeService.startEMSActivitiProcess(workflow_key);
        	}/*else {
        		LOGGER.info("****************************************** Running on activiti - rest");
        		processRestClient.startEMSActivitiProcess(workflow_key);
        	} */       	
			LOGGER.info("###########  SCHEDULE ENDS  - WORK FLOW : Parent EMS Process ###########");
		} catch (BusinessException e) {			
			LOGGER.error("Exception : "+e.getMessage() +" SchedulerService");
		}
		}else
			LOGGER.info("Job schedule disabled" );
        
    }
	
	@Scheduled(cron = "${scheduling.cron.expression.probation}")
    public void cronProbationTask(){
		LOGGER.info(new Date() + "%%%%%%%%%%  ***** set Scheduler Service configuration For Probation Process  ******* %%%%%%%%%%");      
		if (isenabledprobjob.equalsIgnoreCase("1")) {
        try {
        	LOGGER.info("###########  SCHEDULE STARTS - WORK FLOW ###########");
        	if(!serverType.trim().isEmpty() && serverType.equalsIgnoreCase("explorer")) {
        		runtimeService.startEMSActivitiProcess(workflow_key_prob);
        	}      	
			LOGGER.info("###########  SCHEDULE ENDS  - WORK FLOW : Probation Process ###########");
		} catch (BusinessException e) {			
			LOGGER.error("Exception : "+e.getMessage() +" SchedulerService");
		}
		}else
			LOGGER.info("Job schedule disabled : Probation Process" );
        
    }
	
	@Scheduled(cron = "${scheduling.cron.expression.skill.remainder}")
    public void cronSkillRemainderTask(){
		LOGGER.info(new Date() + "%%%%%%%%%%  ***** set Scheduler Service configuration For Skill Remainder Process  ******* %%%%%%%%%%");      
		if (isenabledSkillRemainderjob.equalsIgnoreCase("1")) {
        try {
        	LOGGER.info("###########  SCHEDULE STARTS - WORK FLOW ###########");
        	if(!serverType.trim().isEmpty() && serverType.equalsIgnoreCase("explorer")) {
        		runtimeService.startEMSActivitiProcess(workflow_key_skill_remainder);
        	}      	
			LOGGER.info("###########  SCHEDULE ENDS  - WORK FLOW : Probation Process ###########");
		} catch (BusinessException e) {			
			LOGGER.error("Exception : "+e.getMessage() +" SchedulerService");
		}
		}else
			LOGGER.info("Job schedule disabled : Skill Remainder Process" );
        
    }
	
	@Scheduled(cron = "${scheduling.cron.expression.history.delete}")
    public void deleteHistoryTask(){
		LOGGER.info(new Date() + "%%%%%%%%%%  ***** set Scheduler Service configuration For Deleting History ******* %%%%%%%%%%");      
		if (isenabledHistoryDeleteJob.equalsIgnoreCase("1")) {
        try {
        	LOGGER.info("###########  SCHEDULE STARTS - Deleting History ###########");
        		
        	histService.cleanupHistory();
			
        	LOGGER.info("###########  SCHEDULE ENDS  - Deleting History ###########");
		} catch (BusinessException e) {			
			LOGGER.error("Exception : "+e.getMessage() +" SchedulerService");
		}
		}else
			LOGGER.info("Job schedule disabled : Deleting History " );
        
    }
}
