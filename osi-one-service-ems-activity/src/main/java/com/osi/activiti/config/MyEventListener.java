package com.osi.activiti.config;

import org.activiti.engine.delegate.event.ActivitiEvent;
import org.activiti.engine.delegate.event.ActivitiEventListener;

public class MyEventListener implements ActivitiEventListener {

	@Override
	public void onEvent(ActivitiEvent event) {
		switch (event.getType()) {
		case PROCESS_STARTED:
			System.out.println("New Process Instance has been started.");
			break;

		case PROCESS_COMPLETED:

			String message = (String) event.getEngineServices().getRuntimeService().getVariable(event.getExecutionId(),
					"message");

			System.out.println("Process (started by \"" + message + "\") has been completed.");
			break;

		case VARIABLE_CREATED:
			System.out.println("New Variable was created.");
			System.out.println(">> All Variables in execution scope: "
					+ event.getEngineServices().getRuntimeService().getVariables(event.getExecutionId()));
			break;

		case TASK_ASSIGNED:
			System.out.println("Task has been assigned.");
			break;

		case TASK_CREATED:
			System.out.println("Task has been created.");
			break;

		case TASK_COMPLETED:
			System.out.println("Task \""
					+ event.getEngineServices().getHistoryService().createHistoricTaskInstanceQuery()
							.orderByHistoricTaskInstanceEndTime().asc().list().get(0).getName()
					+ "\" has been completed.");
			break;

		default:
			break;
		}
	}

	@Override
	public boolean isFailOnException() {
		System.out.println("inside isFailOnException()");
		return false;
	}

}
