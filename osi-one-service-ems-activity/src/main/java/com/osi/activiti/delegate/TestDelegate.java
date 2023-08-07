package com.osi.activiti.delegate;

import org.activiti.engine.delegate.BpmnError;
//import org.activiti.engine.impl.pvm.delegate.ActivityBehavior;
import org.activiti.engine.impl.pvm.delegate.ActivityExecution;
import org.springframework.stereotype.Component;

@Component("testDelegate")
public class TestDelegate extends ActivityBehaviour {

	private static final long serialVersionUID = 1L;
	
	/*@Autowired
	private EMSService emsService;*/

	@Override
	public void onExecute(ActivityExecution execution) throws Exception {
		try {
			/*List<OsiWFActivities> wfRecordsList = emsService.getWFRecords(execution);
			execution.setVariable("wfRecordsList", wfRecordsList);*/
		} catch(Exception e) {
			throw new BpmnError("ERR_1001", e.getLocalizedMessage());
		}
		System.out.println("hello......");		
	}

}
