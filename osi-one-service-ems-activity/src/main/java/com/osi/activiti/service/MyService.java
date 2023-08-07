package com.osi.activiti.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.activiti.engine.FormService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.form.TaskFormData;
import org.activiti.engine.task.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class MyService {

	@Autowired
	private RuntimeService runtimeService;

	@Autowired
	private TaskService taskService;
	
	@Autowired
	private FormService formService;

	public String startTestProcess() {
		runtimeService.startProcessInstanceByKey("TestProcess");
		return "Test Process Started";
	}
	public String startProcess(String message, String assignee) {

		Map<String, Object> variables = new HashMap<String, Object>();
		variables.put("message", message);
		variables.put("person", assignee);
		
		if(message == null)
			runtimeService.startProcessInstanceByKey("mailProcess", variables);
		else
			runtimeService.startProcessInstanceByMessage(message, variables);

		return "Process started";
	}
	
	public List<Task> getTasks(String assignee) {
		return taskService.createTaskQuery().taskAssignee(assignee).list();
	}

	public void completeTask(String taskId) {
		taskService.complete(taskId);
	}
	public void completeEmsTask(String taskId, String statusValue) {
		//Map<String, Object> formValues = new HashMap<String, Object>();
		//formValues.put("status", statusValue);
		//taskService.setVariable(taskId, "status", statusValue);
		taskService.setVariable(taskId, "action", statusValue);
		taskService.complete(taskId);
	}
	
	public void completeCustomTask(String taskId, String formData) {
		try {
			
			String fname = formData.split("&")[1].split("=")[1];
			String lname = formData.split("&")[2].split("=")[1];
			Map<String, Object> formValues = new HashMap<String, Object>();
			formValues.put("firstname", fname);
			formValues.put("lastname", lname);
			taskService.complete(taskId, formValues);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	public Map<String, Object> getVariables(String assignee) {
		List<Task> tasks = taskService.createTaskQuery().taskAssignee(assignee).list();
		TaskFormData formData = formService.getTaskFormData(tasks.get(0).getId());
		System.out.println(formData.getFormProperties());
		Map<String, Object> vars = tasks.get(0).getProcessVariables();
		return vars;
	}
}