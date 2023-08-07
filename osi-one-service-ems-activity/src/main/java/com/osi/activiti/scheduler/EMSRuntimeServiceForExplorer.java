package com.osi.activiti.scheduler;

import com.osi.activiti.service.SchedulerHistoryHTTPService;
import org.activiti.engine.RuntimeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.osi.activiti.exception.BusinessException;

@Service("runtimeServiceForExplorer")
public class EMSRuntimeServiceForExplorer {
	
	private final Logger LOGGER = LoggerFactory.getLogger(EMSRuntimeServiceForExplorer.class);
	
//	private ResourceBundle bundle = ResourceBundle.getBundle("resources");
	
	@Autowired
	private RuntimeService runtimeService;

	@Autowired
	private SchedulerHistoryHTTPService schedulerHistoryService;

	/**
	 * startProcess
	 * @throws BusinessException
	 */
	public void startEMSActivitiProcess(String processDefinition) throws BusinessException {
		LOGGER.info("###### Start :EMSRuntimeServiceForExplorer");
		LOGGER.info("************ " + processDefinition);

		Integer schedulerHistoryId = null;
		try {
			schedulerHistoryId = schedulerHistoryService.createSchedulerHistory(processDefinition);

			runtimeService.startProcessInstanceByKey(processDefinition);

			schedulerHistoryService.markAsEnded(
					schedulerHistoryId,
					false,
					null
			);
		} catch (Exception e) {
			schedulerHistoryService.markAsEnded(
					schedulerHistoryId,
					true,
					e.getMessage()
			);
		}
		
		LOGGER.info("###### End : EMSRuntimeServiceForExplorer");
	}
}
