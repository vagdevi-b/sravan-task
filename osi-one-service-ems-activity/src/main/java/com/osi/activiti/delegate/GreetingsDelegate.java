package com.osi.activiti.delegate;

import org.activiti.engine.impl.pvm.delegate.ActivityExecution;

@SuppressWarnings("serial")
public class GreetingsDelegate extends ActivityBehaviour {
	@Override
	public void onExecute(ActivityExecution execution) throws Exception {
		String name = (String) execution.getVariable("name");
		System.out.println(execution.getVariableNames());
		System.out.println("WELCOME to ACTIVITI DEMO .... "+ name);
	}
}
