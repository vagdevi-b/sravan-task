package com.osi.activiti.delegate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.activiti.engine.impl.pvm.PvmTransition;
import org.activiti.engine.impl.pvm.delegate.ActivityExecution;
import org.activiti.engine.impl.pvm.process.ActivityImpl;
import org.activiti.engine.impl.pvm.process.ProcessDefinitionImpl;
import org.activiti.engine.impl.pvm.process.TransitionImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.osi.ems.domain.OsiWFActivities;
import com.osi.ems.repository.IOsiWFActivitiesRepository;

@Component("fetchList")
public class FetchList {
	
	@Autowired
	private IOsiWFActivitiesRepository wfsActivitiesRepo;
	
	//private Expression newEmpList;
	
	public List<OsiWFActivities> getList(){
		System.out.println("hai");
	List<OsiWFActivities> newEmpList = wfsActivitiesRepo.findByProcessFlag("N");
	return newEmpList;
	}
	public Map<String, Object> getMapList(ActivityExecution execution) throws Exception{
		Map<String, Object> output = new HashMap<String, Object>();
		try {
			//List<OsiWFActivities> newEmpList = wfsActivitiesRepo.findByProcessFlag("N");
			//Map<String, Object> output = new HashMap<String, Object>();
			//output.put("list", newEmpList);
			//output.put("size", newEmpList.size());
			//output.put("object", newEmpList.getClass());
		
			//System.out.println(output);
		} catch(Exception e) {
			System.out.println(execution.getCurrentActivityId());
			execution.setVariable("exceptionThrownTaskId", execution.getCurrentActivityId());
			execution.setVariable("exceptionNextTaskId", execution.getActivity().getOutgoingTransitions().get(0).getId());
			
			execution.setVariableLocal("task_name", execution.getCurrentActivityName());
			execution.setVariableLocal("process_instance_id", execution.getProcessInstanceId());
			execution.setVariableLocal("process_definition_id", execution.getProcessDefinitionId());
			execution.setVariableLocal("next_task_name", execution.getActivity().getOutgoingTransitions().get(0).getId());
			
			ProcessDefinitionImpl pd = (ProcessDefinitionImpl) execution.getEngineServices().getRepositoryService().getProcessDefinition(execution.getProcessDefinitionId());
			ActivityImpl errorHandlerActivity = pd.findActivity("errorMailTask");
			ActivityImpl currActivity = (ActivityImpl) execution.getActivity();
			currActivity.getOutgoingTransitions().remove(0);
			
			PvmTransition tempTransition = (currActivity).createOutgoingTransition();
			((TransitionImpl) tempTransition).setDestination(errorHandlerActivity);
			
			
			//execution.take(tempTransition);
			
			//throw new BpmnError("myError");
		}
		return output;
	}
	
	@SuppressWarnings("unchecked")
	public void find(ActivityExecution execution, String var) {
		System.out.println(var);
		System.out.println(execution.getVariableInstances());
		System.out.println(execution.getVariable("${"+var+"}"));
		List<OsiWFActivities> empList = (List<OsiWFActivities>) (execution.getVariable("${"+var+"}"));
		System.out.println(empList.size());
		
		execution.setVariable("size", empList.size());
		execution.setVariable("empList", empList);
		execution.setVariable("emp", empList.getClass());
	}
	
	public String take(ActivityExecution execution) {
		String actionValue = (String) execution.getVariable("action");
		System.out.println(execution.getVariables());
		/*if(actionValue.equalsIgnoreCase("proceed")) {
			String nxtTaskName = (String) execution.getVariable("next_task_name");
		}*/
		
		ProcessDefinitionImpl pd = (ProcessDefinitionImpl) execution.getEngineServices().getRepositoryService().getProcessDefinition(execution.getProcessDefinitionId());
		ActivityImpl errorHandlerActivity = pd.findActivity("scripttask1");
		ActivityImpl currActivity = (ActivityImpl) execution.getActivity();
		//currActivity.getOutgoingTransitions().remove(0);
		PvmTransition tempTransition = (currActivity).createOutgoingTransition();
		((TransitionImpl) tempTransition).setDestination(errorHandlerActivity);
		
		System.out.println(actionValue);
		return null;
	}
}
