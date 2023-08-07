package com.osi.activiti.config;

import org.activiti.engine.delegate.event.ActivitiEntityEvent;
import org.activiti.engine.delegate.event.ActivitiEvent;
import org.activiti.engine.delegate.event.ActivitiEventListener;
import org.activiti.engine.impl.persistence.entity.ExecutionEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ProcessStartEventListener implements ActivitiEventListener {

	private final Logger LOGGER = LoggerFactory.getLogger(getClass());
	public static final String MAIN_PROCESS_INST_ID = "mainProcessInstanceId";
	@Override
	public void onEvent(ActivitiEvent event) {
		String mainProcessInstanceId = null;
		LOGGER.info("************************");
		/*
		 *  a process started, checking parent if it has the mainProcessInstanceId variable, 
		 *  but first, we need to check if there's a parent at all.
		 */
		ExecutionEntity executionEntity = (ExecutionEntity) ((ActivitiEntityEvent) event).getEntity();

		if (null == executionEntity.getSuperExecution()) {
			// no parent, set current process instance Id as the main one.
			mainProcessInstanceId = executionEntity.getProcessInstanceId();
		} else {
			// there's a parent, get the main process instance
			ExecutionEntity rootExecution = executionEntity.getSuperExecution();
			mainProcessInstanceId = (String) rootExecution.getProcessInstance().getVariable(MAIN_PROCESS_INST_ID);

			if (mainProcessInstanceId == null) {
				/*
				 * If there is not mainProcessInstanceId variable in the parent, then this mean the parent didn't trigger the event listener
				 * and the whole process is inconsistent, throw an exception and exit.
				 */
				throw new IllegalArgumentException("Cannot find " + MAIN_PROCESS_INST_ID + " in process variables");
			}
		}
		event.getEngineServices().getRuntimeService().setVariable(event.getExecutionId(), MAIN_PROCESS_INST_ID, mainProcessInstanceId);
		LOGGER.info("---------- mainProcessInstanceId:: "+mainProcessInstanceId+" for subprocess: "+event.getProcessInstanceId());
	}
    
	@Override
	public boolean isFailOnException() {
		return false;
	}
}
