package com.osi.activiti.delegate;

import java.util.ArrayList;
import java.util.List;

import org.activiti.engine.impl.pvm.PvmTransition;
import org.activiti.engine.impl.pvm.delegate.ActivityBehavior;
import org.activiti.engine.impl.pvm.delegate.ActivityExecution;
import org.activiti.engine.impl.pvm.process.ActivityImpl;
import org.activiti.engine.impl.pvm.process.ProcessDefinitionImpl;
import org.activiti.engine.impl.pvm.process.TransitionImpl;

//import com.osi.activiti.exception.NoTransitionFoundException;

public class VerifyMailInputs implements ActivityBehavior {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Override
	public void execute(ActivityExecution execution) throws Exception {
		String mailAddress = (String) execution.getVariable("email");
		String mailSubject = (String) execution.getVariable("subject");
		String mailBody = (String) execution.getVariable("mailBody");
		
		boolean isValid = true;
		List<String> missedVariables = new ArrayList<String>();
		if(null == mailAddress || mailAddress.trim().isEmpty()) {
			isValid = false;
			missedVariables.add("email");
		}
		if(null == mailSubject || mailSubject.trim().isEmpty()) {
			isValid = false;
			missedVariables.add("subject");
		}
		if(null == mailBody || mailBody.trim().isEmpty()) {
			isValid = false;
			missedVariables.add("mailBody");
		}
		
		execution.setVariableLocal("failed-activity-source", execution.getActivity().getIncomingTransitions().get(0).getSource().getId());
		// Storing the next activity ID to be able to proceed the task if
		// required
		try {
			execution.setVariableLocal("failed-activity-next", execution.getActivity().getOutgoingTransitions().get(0).getDestination().getId());
		} catch (Exception exception) {
			//LOGGER.error("MPID: " + getMainProcessId(execution) + " No transtion found in handleError ");
			//throw new NoTransitionFoundException("MPID: " + getMainProcessId(execution) + " FATAL No transition found");
		}
		
		if(!isValid) {
			System.out.println(execution.getCurrentActivityName());
			System.out.println(execution.getActivity().getOutgoingTransitions().get(0));
			//execution.setVariableLocal("failed-activity-source", execution.getCurrentActivityId());
				
			ProcessDefinitionImpl pd = (ProcessDefinitionImpl) execution.getEngineServices().getRepositoryService()
					.getProcessDefinition(execution.getProcessDefinitionId());
			ActivityImpl manualInputActivity = pd.findActivity("hrAlert");
			ActivityImpl currentActivity = (ActivityImpl) execution.getActivity();
			//currentActivity.getOutgoingTransitions().remove(0);
			PvmTransition tempTransition = (currentActivity).createOutgoingTransition();
			((TransitionImpl) tempTransition).setDestination(manualInputActivity);
			System.out.println(tempTransition);
			execution.take(tempTransition);
				
			// remove the temporary transition
			//manualInputActivity.getIncomingTransitions().remove(tempTransition);
			currentActivity.getOutgoingTransitions().remove(tempTransition);
		} else {
			List<PvmTransition> outGoingTransitions = execution.getActivity().getOutgoingTransitions();
			if (outGoingTransitions == null || outGoingTransitions.size() == 0) {
				//LOGGER.error("MPID: " + getMainProcessId(execution) + " FATAL exception, No transition found from ");
				//throw new NoTransitionFoundException("MPID: " + getMainProcessId(execution) + " FATAL No transition found from ");
			} else
				execution.take(outGoingTransitions.get(0));
		}
	}
}
