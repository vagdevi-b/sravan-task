package com.osi.activiti.delegate;

import java.util.List;

import org.activiti.engine.impl.bpmn.behavior.ReceiveTaskActivityBehavior;
import org.activiti.engine.impl.pvm.PvmTransition;
import org.activiti.engine.impl.pvm.delegate.ActivityExecution;
import org.activiti.engine.impl.pvm.process.ActivityImpl;
import org.activiti.engine.impl.pvm.process.ProcessDefinitionImpl;
import org.activiti.engine.impl.pvm.process.TransitionImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.osi.activiti.exception.BusinessException;
import com.osi.activiti.exception.NoErrorHandlerTaskException;
import com.osi.activiti.exception.NoTransitionFoundException;

public abstract class ActivityBehaviour extends ReceiveTaskActivityBehavior {
	/**
	 * 
	 */
	public static final String MAIN_PROCESS_INST_ID = "mainProcessInstanceId";
	public static final String ERROR_HANLDER_ID = "error-handler";
	private static final long serialVersionUID = 1L;
	private final Logger LOGGER = LoggerFactory.getLogger(ActivityBehaviour.class);
	
	@Override
	public void execute(ActivityExecution execution) throws Exception {
		
		try {
			LOGGER.info("MPID: " + getMainProcessId(execution) + " *** executing task: " + getTaskTag(execution) + " "
					+ execution.getCurrentActivityName());
			
			onExecute(execution);
			
			// If task is done with no errors, then move on.
			proceed(execution);
			
		} catch (BusinessException e) {
			// Task fail, call error handle to jump to the error screen.
			LOGGER.error("MPID: " + getMainProcessId(execution) + " task failed", e);
			//e.printStackTrace();
			handleError(execution, e);
		}
	}
	
	public abstract void onExecute(ActivityExecution execution) throws Exception;
	
	protected void proceed(ActivityExecution execution) throws Exception{
		
		// take the outgoing transition.
		List<PvmTransition> outGoingTransitions = execution.getActivity().getOutgoingTransitions();
		if (outGoingTransitions == null || outGoingTransitions.size() == 0) {
			LOGGER.error("MPID: " + getMainProcessId(execution) + " FATAL exception, No transition found from ");
			//throw new NoTransitionFoundException("MPID: " + getMainProcessId(execution) + " FATAL No transition found from ");
		}
		execution.take(outGoingTransitions.get(0));
	}
	
	protected String getMainProcessId(ActivityExecution execution) {
		return (String) execution.getVariable(MAIN_PROCESS_INST_ID);
	}
	
	/**
	 * Return a unique task definition
	 * 
	 * @param execution
	 * @return
	 */
	public String getTaskTag(ActivityExecution execution) {
		return execution.getProcessDefinitionId() + "_" + execution.getCurrentActivityId() + "_"
				+ execution.getProcessInstanceId();
	}
	
	/**
	 * 
	 * @param execution
	 * @param e
	 *            instanceof BusinessException
	 * @throws BusinessException
	 */

	protected void handleError(ActivityExecution execution, BusinessException e) throws Exception {
		
		LOGGER.info("****************** start:  handleError");
		ProcessDefinitionImpl pd = (ProcessDefinitionImpl) execution.getEngineServices().getRepositoryService()
				.getProcessDefinition(execution.getProcessDefinitionId());
		
		ActivityImpl errorHandlerActivity = null;
		// get the error handler task
		
		errorHandlerActivity = pd.findActivity(ERROR_HANLDER_ID);
		
		if (errorHandlerActivity == null) {
			LOGGER.error("MPID: " + getMainProcessId(execution) + " FATAL excpetion, error handler task not found");
			throw new NoErrorHandlerTaskException("MPID: " + getMainProcessId(execution) + "FATAL error handler task not found");

		}

		ActivityImpl currActivity = (ActivityImpl) execution.getActivity();
		PvmTransition tempTransition = (currActivity).createOutgoingTransition();
		((TransitionImpl) tempTransition).setDestination(errorHandlerActivity);

		// Storing the current activity ID to be able to retry the task if
		// required
		// TODO handle if two tasks failed at the same time, or if the var is
		// not null.
		execution.setVariableLocal("failed-activity-source", execution.getCurrentActivityId());
		// Storing the next activity ID to be able to proceed the task if
		// required
		try {
			execution.setVariableLocal("failed-activity-next", execution.getActivity().getOutgoingTransitions().get(0).getDestination().getId());
		} catch (Exception exception) {
			LOGGER.error("MPID: " + getMainProcessId(execution) + " No transtion found in handleError ");
			throw new NoTransitionFoundException("MPID: " + getMainProcessId(execution) + " FATAL No transition found");
		}

		// Error details
		execution.setVariableLocal("task-name", execution.getCurrentActivityName());
		execution.setVariableLocal("process-instance-id", execution.getProcessInstanceId());
		execution.setVariableLocal("process-definition-id", execution.getProcessDefinitionId());
		execution.setVariableLocal("error", e.getSystemMessage());

		// Building dynamic routing to error handler is done, taking transition
		// out.
		
		LOGGER.info("########## "+execution.getCurrentActivityId());
		LOGGER.info("next ------- "+execution.getActivity().getOutgoingTransitions().get(0).getDestination().getId());
		LOGGER.info("tempTransition :"+tempTransition);
		execution.take(tempTransition);
			
		LOGGER.info("########## "+execution.getCurrentActivityId());
		LOGGER.info("next ------- "+execution.getActivity().getOutgoingTransitions().get(0).getDestination().getId());
			
		// remove the temporary transition
		errorHandlerActivity.getIncomingTransitions().remove(tempTransition);
		currActivity.getOutgoingTransitions().remove(tempTransition);
		LOGGER.info("getCurrentActivityName(): "+execution.getCurrentActivityName());
		
		System.out.println("execution.getActivity().getOutgoingTransitions()"+execution.getActivity().getOutgoingTransitions());
		// TODO currently manually forward to post error handler service task
		//execution.take(execution.getActivity().getOutgoingTransitions().get(0));
		
		
	}
}
