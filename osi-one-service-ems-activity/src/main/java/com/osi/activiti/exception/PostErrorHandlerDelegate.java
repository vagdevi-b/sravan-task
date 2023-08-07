package com.osi.activiti.exception;

import org.activiti.engine.impl.pvm.PvmTransition;
import org.activiti.engine.impl.pvm.delegate.ActivityBehavior;
import org.activiti.engine.impl.pvm.delegate.ActivityExecution;
import org.activiti.engine.impl.pvm.process.ActivityImpl;
import org.activiti.engine.impl.pvm.process.ProcessDefinitionImpl;
import org.activiti.engine.impl.pvm.process.TransitionImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 
 * @author smanchala
 *
 */
public class PostErrorHandlerDelegate implements ActivityBehavior {

	/**
	 * 
	 */
	private static final long serialVersionUID = -4389567189086780951L;

	public static final String MAIN_PROCESS_INST_ID = "mainProcessInstanceId";
	public static final String ERROR_HANLDER_ID = "error-handler";
	public static final String ERROR_HANDLER_VARS_ACTION = "action";
	public static final String ERROR_HANDLER_VARS_SOURCE_ACTIVITY = "failed-activity-source";
	public static final String ERROR_HANDLER_VARS_NEXT_ACTIVITY = "failed-activity-next";
	
	private final Logger LOGGER = LoggerFactory.getLogger(getClass());
	
	@Override
	public void execute(ActivityExecution execution) throws Exception {
		
		LOGGER.info("****************** start:  PostErrorHandlerDelegate");
		
		String processInstance = execution.getVariable(MAIN_PROCESS_INST_ID) + "";
		ProcessDefinitionImpl pd = (ProcessDefinitionImpl) execution.getEngineServices().getRepositoryService()
				.getProcessDefinition(execution.getProcessDefinitionId());
		ActivityImpl resumeActivity;
		String action = (String) execution.getVariable(ERROR_HANDLER_VARS_ACTION);
		
		LOGGER.info("PostErrorHandlerDelegate ---- action: "+action);

		// TODO : currently hard code the action value to retry
		//action = (null == action) ? "retry" : action;

		String sourceActivityId = (String) execution.getVariable(ERROR_HANDLER_VARS_SOURCE_ACTIVITY);
		String nextActivityId = (String) execution.getVariable(ERROR_HANDLER_VARS_NEXT_ACTIVITY);
		LOGGER.info("sourceActivityId: " + sourceActivityId);
		LOGGER.info("nextActivityId: " + nextActivityId);
		
		if (action.equals("proceed")) {
			// proceed
			resumeActivity = pd.findActivity(nextActivityId);
			
		} else {
			// retry
			resumeActivity = pd.findActivity(sourceActivityId);
			
		}

		LOGGER.info("MPID: " + processInstance + " Handling error for activity: " + sourceActivityId + " with " + action
				+ " transitioning to " + (action.equals("proceed") ? nextActivityId : sourceActivityId));

		ActivityImpl currActivity = (ActivityImpl) execution.getActivity();
		PvmTransition tempTransition = (currActivity).createOutgoingTransition();
		((TransitionImpl) tempTransition).setDestination(resumeActivity);

		execution.take(tempTransition);

		// remove the temporary transition and cleanup the context variables
		resumeActivity.getIncomingTransitions().remove(tempTransition);
		currActivity.getOutgoingTransitions().remove(tempTransition);
		//execution.removeVariable(ERROR_HANDLER_VARS_NEXT_ACTIVITY);
		//execution.removeVariable(ERROR_HANDLER_VARS_SOURCE_ACTIVITY);
		//execution.removeVariable(ERROR_HANDLER_VARS_ACTION);
	}

}
