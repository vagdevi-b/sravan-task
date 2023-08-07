package com.osi.activiti.rest;

import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.osi.activiti.service.EMSProcessStartService;

@RestController
public class EMSProcessStartController {
	
	private final Logger LOGGER = LoggerFactory.getLogger(getClass());

	@Autowired
	private EMSProcessStartService processStartService;
	
	@RequestMapping(value = "/empcreation", method = RequestMethod.GET)
	public void startProcessInstance() {
		LOGGER.info("###### EMSProcessStartController -- startProcessInstance : Begin");
		try {
			processStartService.startProcess("EMSParentProcess");
		} catch (Exception e) {
			e.printStackTrace();
		}
		LOGGER.info("###### EMSProcessStartController -- startProcessInstance : End");
	}
	
	@RequestMapping(value = "/skillremainder", method = RequestMethod.GET)
	public void startProcessInstanceForSkillRemainder() {
		LOGGER.info("###### EMSProcessStartController -- startProcessInstanceForSkillRemainder : Begin");
		try {
			processStartService.startProcess("EmpSkillRemainderProcess");
		} catch (Exception e) {
			e.printStackTrace();
		}
		LOGGER.info("###### EMSProcessStartController -- startProcessInstanceForSkillRemainder : End");
	}
	
	@RequestMapping(value = "/probationProcess", method = RequestMethod.GET)
	public void startProcessInstanceForProbationProcess() {
		LOGGER.info("###### EMSProcessStartController -- startProcessInstanceForProbationProcess : Begin");
		try {
			processStartService.startProcess("EmployeeProbationProcess_One");
		} catch (Exception e) {
			e.printStackTrace();
		}
		LOGGER.info("###### EMSProcessStartController -- startProcessInstanceForProbationProcess : End");
	}
	
	@RequestMapping(value = "/completeerrortask/{action}")
	public String completeTask(@RequestParam String id, @PathVariable("action") String action) {
		processStartService.completeTask(id, action);
		return "Task with id " + id + " has been completed!";
	}
	
	/*@RequestMapping(value = "{pid}/completeusertask")
	public String completeUserTask(@RequestParam String dlList, @PathVariable("pid") String pid) {
		processStartService.completeUserTask(pid, dlList);
		return "";
		//return "Task with id " + id + " has been completed!";
	}*/
	/*@RequestMapping(value = "/{pid}/completeuserstask")
	public String completeUserTask2(@RequestParam String emailId, @RequestParam String username, @RequestParam String serialnumber, @PathVariable("pid") String pid) {
		processStartService.completeUserTask2(pid, emailId, username, serialnumber);
		return "";
		//return "Task with id " + id + " has been completed!";
	}*/
	/*@RequestMapping(value = "{pid}/completeprobationtask")
	public String completeprobationtask(@PathVariable String pid, @RequestParam String probationAction,@RequestParam Integer extendedValue) {
		processStartService.completeProbationTask(pid, probationAction, extendedValue);
		return "Task with id " + pid + " has been completed!";
	}*/
	@RequestMapping(value = "{pid}/completetermination/{type}")
	public String completeterminationtask(@PathVariable String pid, @PathVariable String type) {
		processStartService.completeTerminationTask(pid, type);
		return "Task with id " + pid + " has been completed!";
	}
	
	// Written for outlook request params handling (x_)
	
	@RequestMapping(value = "{pid}/completeusertask")
	public String completeUserTaskOutlook(@RequestParam MultiValueMap<String, String> queryMap, @PathVariable("pid") String pid) {
		System.out.println("OUTLOOK is called....");
		String returnValue = "";
		String dlList = null;
		List<String> valueList = null;
		try {
			if(queryMap.keySet().size() == 1) {
				if(queryMap.keySet().iterator().next().endsWith("dlList"))
					valueList = queryMap.values().iterator().next();
			}
			if(!valueList.isEmpty()) {
				dlList = valueList.stream().map(Object::toString).collect(Collectors.joining(","));
				if(dlList.startsWith(","))
					dlList = dlList.substring(1, dlList.length());
				if(dlList != null)
					returnValue = processStartService.completeUserTask(pid, dlList);
				else
					returnValue = "Invalid Request";
			}else {
				returnValue = "Invalid DL List";
			}
			
		} catch(Exception e) {
			returnValue = "Request Not Processed";
		}
		return returnValue;
		//return "Task with id " + id + " has been completed!";
	}
	
	@RequestMapping(value = "/{pid}/completeuserstask")
	public String completeUserTask2(@RequestParam Map<String, String> queryMap, @PathVariable("pid") String pid) {
		System.out.println("OUTLOOK is called....");
		String returnValue = "";
		String emailId = null;
		String username = null;
		String serialnumber = null;
		try {
			if(queryMap.keySet().size() == 3) {
				Iterator<String> iterator = queryMap.keySet().iterator();
				while(iterator.hasNext()) {
					String key = iterator.next();
					if(key.endsWith("emailId"))
						emailId = queryMap.get(key);
					else if(key.endsWith("username"))
						username = queryMap.get(key);
					else if(key.endsWith("serialnumber"))
						serialnumber = queryMap.get(key);
				}
			}
			
			if(emailId != null && username != null && serialnumber != null)
				returnValue = processStartService.completeUserTask2(pid, emailId, username, serialnumber);
			else
				returnValue = "Invalid Request Parameters";
		} catch(Exception e) {
			returnValue = "Request Not Processed";
		}
		return returnValue;
		//return "Task with id " + id + " has been completed!";
	}
	
	@RequestMapping(value = "/{pid}/completeAdminTask")
	public String completeAdminTask(@RequestParam Map<String, String> queryMap, @PathVariable("pid") String pid) {
		System.out.println("OUTLOOK is called....");
		String returnValue = "";
		String mailStop = null;
		try {
			if(queryMap.keySet().size() == 1) {
				if(queryMap.keySet().iterator().next().endsWith("mailStop"))
					mailStop = queryMap.values().iterator().next();
			}
			
			if(mailStop != null)
				returnValue = processStartService.completeAdminTask(pid, mailStop);
			else
				returnValue = "Invalid Request Parameters";
		} catch(Exception e) {
			returnValue = "Request Not Processed";
		}
		return returnValue;
		//return "Task with id " + id + " has been completed!";
	}
	
	
	@RequestMapping(value = "{pid}/completeprobationtask")
	public String completeprobationtask(@PathVariable String pid, @RequestParam Map<String, String> queryMap) {
		System.out.println("OUTLOOK is called....");
		String returnValue = "";
		String probationAction = null;
		String extendedValue = null;
		String probationReason = null;
		/*String probationActionBu = null;
		String extendedValueBu = null;
		String probationReasonBu = null;
		String probationActionHr = null;
		String extendedValueHr = null;
		String probationReasonHr = null;*/
		try {
			if(queryMap.keySet().size() == 3) {
				Iterator<String> iterator = queryMap.keySet().iterator();
				while(iterator.hasNext()) {
					String key = iterator.next();
					if(key.endsWith("probationAction"))
						probationAction = queryMap.get(key);
					else if(key.endsWith("extendedValue"))
						extendedValue = queryMap.get(key);
					else if(key.endsWith("probationReason"))
						probationReason = queryMap.get(key);
					else if(key.endsWith("probationActionBu"))
						probationAction = queryMap.get(key);
					else if(key.endsWith("extendedValueBu"))
						extendedValue = queryMap.get(key);
					else if(key.endsWith("probationReasonBu"))
						probationReason = queryMap.get(key);
					else if(key.endsWith("probationActionHr"))
						probationAction = queryMap.get(key);
					else if(key.endsWith("extendedValueHr"))
						extendedValue = queryMap.get(key);
					else if(key.endsWith("probationReasonHr"))
						probationReason = queryMap.get(key);
				}
			}
			
			if(probationAction != null) {
				if(probationAction.equalsIgnoreCase("extend") && !extendedValue.isEmpty())
					returnValue = processStartService.completeProbationTask(pid, probationAction, Integer.parseInt(extendedValue), probationReason);
				else if(!probationAction.equalsIgnoreCase("extend")) {
					returnValue = processStartService.completeProbationTask(pid, probationAction, 0, probationReason);
				} else
					returnValue = "Invalid Extended Probation value";
			} else
				returnValue = "Invalid Request Parameters";
		} catch(Exception e) {
			returnValue = "Request Not Processed";
		}
		return returnValue;
	}
}
