package com.osi.activiti.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.transaction.Transactional;

import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.task.Task;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.osi.activiti.exception.BusinessException;
import com.osi.ems.service.EmployeeService;

@Service
@Transactional
public class EMSProcessStartService {
	
private final Logger LOGGER = LoggerFactory.getLogger(getClass());
	
	
	@Autowired
	private RuntimeService runtimeService;
	
	@Autowired
	private TaskService taskService;
	
	@Autowired
	private EmployeeService employeeService;

	@Transactional
	public void startProcess(String processKey) throws Exception {		
		LOGGER.info("######  EMSProcessStartService -- startProcess : Begin");
		//runtimeService.startProcessInstanceByKey(ActivitiUtil.NEW_EMPLOYEE_CREATION_PROCESS);
		//runtimeService.startProcessInstanceByKey("emsProcess");
		
		runtimeService.startProcessInstanceByKey(processKey);
		/*
		String processFlag = env.getProperty("emp.creation.process.flag");
		String objectName = env.getProperty("emp.creation.process.objectname");
		
		Map<String, Object> variables = new HashMap<String, Object>();
		variables.put("processFlag", processFlag);
		variables.put("objectName", objectName);
		runtimeService.startProcessInstanceByKey("EmployeeCreationProcess_One", variables);
		*/
		
		LOGGER.info("######  EMSProcessStartService -- startProcess : End");
	}
	
	public void completeTask(String taskId, String action) {
		taskService.setVariable(taskId, "action", action);
		/*System.out.println(taskService.getVariables(taskId));
		String failedActivityNext = (String) taskService.getVariable(taskId, "failed-activity-next");
		String actionValue = (String) taskService.getVariable(taskId, "action");
		String faliedActivitySource = (String) taskService.getVariable(taskId, "failed-activity-source");
		runtimeService.*/
		taskService.complete(taskId);
	}
	
	public String completeUserTask(String pid, String dlList) {
		String returnVal = "";
		try {
			List<Task> taskList = taskService.createTaskQuery().processInstanceId(pid).list();
			String taskId = null;
			for(Task t : taskList) {
				if(t.getName().equalsIgnoreCase("Get DL List From HR")) {
					taskId = t.getId();
				}
			}
			if(!taskList.isEmpty()) {
				taskService.setVariable(taskId, "dlList", dlList);
				taskService.complete(taskId);
				returnVal = "Process Completed Successfully..";
			} else {
				returnVal = "No Process Found with the given Id";
			}
		} catch(Exception e) {
			returnVal = "No Process Found with the given Id";
		}
		return returnVal;
	}
	
	public String completeUserTask2(String pid, String emailId, String username, String serialnumber) {
		String returnVal = "";
		try {
			List<Task> taskList = taskService.createTaskQuery().processInstanceId(pid).list();
			String taskId = null;
			for(Task t : taskList) {
				if(t.getName().equalsIgnoreCase("Get Emp Info from IT Team")) {
					taskId = t.getId();
				}
			}
			String forward = "";
			if(!taskList.isEmpty()) {
				Map<String, Boolean> resultMap = employeeService.checkUsernameOrOfficeEmailExist(emailId, username);
				if(!resultMap.isEmpty() && resultMap.size() == 2) {
					for (Map.Entry<String, Boolean> entry : resultMap.entrySet()) {
						if(entry.getValue().booleanValue() == true) {
							forward = entry.getKey();
							break;
						}
					}
				} else {
					throw new BusinessException("", "Unable to Process your request");
				}
				if(forward == "") {
					Map<String, String> input = new HashMap<String, String>();
					input.put("emailId", emailId);
					input.put("username", username);
					input.put("serialnumber", serialnumber);
					taskService.setVariables(taskId, input);
					taskService.complete(taskId);
					returnVal = "Process Completed Successfully..";
				} else {
					returnVal = forward + " : Already Exist";
				}
			} else {
				returnVal = "No Process Found with the given Id";
			}
		} catch(BusinessException e) {
			returnVal = e.getSystemMessage();
		} catch(Exception e) {
			returnVal = "Unable to Process your Request";
		}
		return returnVal;
	}
	
	public String completeAdminTask(String pid, String mailStop) {
		String returnVal = "";
		try {
			List<Task> taskList = taskService.createTaskQuery().processInstanceId(pid).list();
			String taskId = null;
			for(Task t : taskList) {
				if(t.getName().equalsIgnoreCase("Get Seat Info From Admin")) {
					taskId = t.getId();
				}
			}
			if(!taskList.isEmpty()) {
				taskService.setVariable(taskId, "mailStop", mailStop);
				taskService.complete(taskId);
				returnVal = "Process Completed Successfully..";
			} else {
				returnVal = "No Process Found with the given Id";
			}
		} catch(Exception e) {
			returnVal = "No Process Found with the given Id";
		}
		return returnVal;
	}
	
	public String completeProbationTask(String pid, String probationAction, Integer extendedValue, String probationReason) {
		String returnVal = "";
		try {
			List<Task> taskList = taskService.createTaskQuery().processInstanceId(pid).list();
			String taskId = null;
			String type= "";
			for(Task t : taskList) {
				if(t.getName().equalsIgnoreCase("Capture the RM response")) {
					taskId = t.getId();
				} else if(t.getName().equalsIgnoreCase("Capture BU Head Response")) {
					taskId = t.getId();
					type = "Bu";
				} else if(t.getName().equalsIgnoreCase("Capture HR Response")) {
					taskId = t.getId();
					type = "Hr";
				}
			}
			if(!taskList.isEmpty()) {
				taskService.setVariable(taskId, "probationAction"+type, probationAction);
				taskService.setVariable(taskId, "probationReason"+type, probationReason);
				if(extendedValue != null) {
					taskService.setVariable(taskId, "extendedValue"+type, extendedValue);
				}
				taskService.complete(taskId);
				returnVal = "Process Completed Successfully..";
			} else {
				returnVal = "No Process Found with the given Id";
			}
		} catch(Exception e) {
			returnVal = "Unable to Process your Request";
		}
		return returnVal;
	}
	
	public void completeTerminationTask(String pid, String type) {
		List<Task> taskList = taskService.createTaskQuery().processInstanceId(pid).list();
		String taskId = null;
		for(Task t : taskList) {
			if(t.getName().equalsIgnoreCase("Receive Ack From PMO") && type.equalsIgnoreCase("pmo")) {
				taskId = t.getId();
				taskService.setVariable(taskId, "terminationPmoStatus", "done");
			} else if(t.getName().equalsIgnoreCase("Receive Ack From IT") && type.equalsIgnoreCase("it")) {
				taskId = t.getId();
				taskService.setVariable(taskId, "terminationItStatus", "done");
			} else if(t.getName().equalsIgnoreCase("Receive Ack From TMS") && type.equalsIgnoreCase("tms")) {
				taskId = t.getId();
				taskService.setVariable(taskId, "terminationTmsStatus", "done");
			} else if(t.getName().equalsIgnoreCase("Receive Ack From LMS") && type.equalsIgnoreCase("lms")) {
				taskId = t.getId();
				taskService.setVariable(taskId, "terminationLmsStatus", "done");
			} else if(t.getName().equalsIgnoreCase("Receive Ack From Expense System") && type.equalsIgnoreCase("finance")) {
				taskId = t.getId();
				taskService.setVariable(taskId, "terminationFinStatus", "done");
			} else if(t.getName().equalsIgnoreCase("Receive Ack From HR Team") && type.equalsIgnoreCase("hr")) {
				taskId = t.getId();
				taskService.setVariable(taskId, "terminationHrStatus", "done");
			} else if(t.getName().equalsIgnoreCase("Receive Ack From Admin Team") && type.equalsIgnoreCase("admin")) {
				taskId = t.getId();
				taskService.setVariable(taskId, "terminationAdminStatus", "done");
			}
		}
		System.out.println(taskList);
		taskService.complete(taskId);
	}
}
