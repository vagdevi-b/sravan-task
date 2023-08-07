package com.osi.activiti.rest;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.activiti.bpmn.model.BpmnModel;
import org.activiti.engine.ActivitiObjectNotFoundException;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.task.Task;
import org.activiti.image.ProcessDiagramGenerator;
import org.activiti.image.impl.DefaultProcessDiagramGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.osi.activiti.service.MyService;

@JsonIgnoreProperties(ignoreUnknown=true)
@RestController
public class MyController {

	@Autowired
	private MyService myService;
	
	@Autowired
	private RepositoryService repoService;
	
	@Autowired
	private RuntimeService runtimeService;

	@RequestMapping(value="/testprocess")
	public String startTestProcess() {
		return myService.startTestProcess();
	}
	@RequestMapping(value = "/startprocess/{message}")
	public String startProcessInstance(@PathVariable("message") String message, @RequestParam String assignee) {
		return myService.startProcess(message, assignee);
	}
	
	@RequestMapping(value = "/startmailprocess")
	public String startMailProcessInstance(@RequestParam String assignee) {
		return myService.startProcess(null, assignee);
	}

	@RequestMapping(value = "/tasks/{assignee}")
	public String getTasks(@PathVariable("assignee") String assignee) {
		List<Task> tasks = myService.getTasks(assignee);
		return tasks.toString();
	}
	
	@RequestMapping(value = "/completetask")
	public String completeTask(@RequestParam String id) {
		myService.completeTask(id);
		return "Task with id " + id + " has been completed!";
	}

	@RequestMapping(value = "/completemailtask")
	public String completeMailTask(@RequestParam String id, @RequestBody String myFormData) {
		//myService.completeTask(id);
		myService.completeCustomTask(id, myFormData);
		return "Task with id " + id + " has been completed!";
	}
	
	@RequestMapping(value = "/taskvariables/{assignee}")
	public String getTaskVariables(@PathVariable("assignee") String assignee) {
		Map<String, Object> tasks = myService.getVariables(assignee);
		return tasks.toString();
	}
	
	@CrossOrigin/*(origins = "http://localhost:8080")*/
	@RequestMapping(value = "/status/{pdid}/{pid}", method=RequestMethod.GET)
	public Map<String, String> processStatus(@PathVariable String pdid, @PathVariable String pid) throws IOException {
			Map<String, String> result = new HashMap<>();
			String encodedString = null;
		    //if (pde != null && pde.isGraphicalNotationDefined()) {
		      BpmnModel bpmnModel = repoService.getBpmnModel(pdid);
		      ProcessDiagramGenerator pdg = new DefaultProcessDiagramGenerator();
		      try {
		      InputStream imageStream = pdg.generateDiagram(bpmnModel, "png", runtimeService.getActiveActivityIds(pid));
		      if (imageStream == null) { 
		          //getResponse().setStatus(Status.CLIENT_ERROR_NOT_FOUND); 
		          encodedString = null; 
		        } else {
					//return new InputRepresentation(imageStream, MediaType.IMAGE_PNG));
					
					int size = imageStream.available(); 
			        byte[] buffer = new byte[size]; 
			        int bytesRead = imageStream.read(buffer); 
			        if (bytesRead != size) { 
			            throw new IOException("Only " + bytesRead + " of " + size + " could be read."); 
			        } 		        
					byte[] encoded = org.apache.tomcat.util.codec.binary.Base64.encodeBase64(buffer);
				    encodedString = new String(encoded, "UTF-8");
		        }		      
		    /*} else {
		      throw new ActivitiException("Process instance with id " + processInstanceId + " has no graphic description");
		    }*/
		      } catch(ActivitiObjectNotFoundException aonf) {
		    	  encodedString = "Activiti is Closed";
		      }
		      result.put("imag", encodedString);
		      return result;
	}
	
	@RequestMapping(value = "/completeemstask/{status}")
	public String completeEmsTask(@RequestParam String id, @PathVariable("status") String status) {
		myService.completeEmsTask(id, status);
		return "Task with id " + id + " has been completed!";
	}

	@CrossOrigin/*(origins = "http://localhost:8080")*/
	@RequestMapping(value = "/runningprocesses", method=RequestMethod.GET)
	public List<Map<String, String>> testing() {
		List<Map<String, String>> processesList = new ArrayList<>();
		List<ProcessInstance> processes = runtimeService.createProcessInstanceQuery().orderByProcessDefinitionId().asc().list();
		//System.out.println(processes.size());
		Iterator<ProcessInstance> ite = processes.iterator();
		while(ite.hasNext()) {
			Map<String, String> runningProcesses = new HashMap<>();
			ProcessInstance p = ite.next();
			runningProcesses.put("pdid", p.getProcessDefinitionId());
			runningProcesses.put("pid", p.getProcessInstanceId());
			
			processesList.add(runningProcesses);
		}
		return processesList;
	}
	
	@RequestMapping(value="/mailSample")
	public String startProcess() {
		runtimeService.startProcessInstanceByKey("mailSample");
		return "started";
	}
}
