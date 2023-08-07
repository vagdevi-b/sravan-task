package com.osi.activiti.config;

import java.util.List;

import javax.annotation.PostConstruct;

import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.repository.Deployment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;


/**
 * FAS Process Deployments
 * @author smanchala
 *
 */
@Configuration
public class ActivitiInit {
	
	@Autowired
	protected RepositoryService repositoryService;
	
	@Autowired
	protected RuntimeService runtimeService;
	
	@PostConstruct
	 public void init() {
		initFASProcessDeployments();
	}
	 
	protected void initFASProcessDeployments() {
	    
	    String deploymentName = "Activiti processes";
	    List<Deployment> deploymentList = repositoryService.createDeploymentQuery().deploymentName(deploymentName).list();
	    System.out.println("*********************************************************************************");
	    System.out.println(deploymentList);
	    
	    /*ListIterator<Deployment> deployments = deploymentList.listIterator();
	    while(deployments.hasNext()) {
	    	Deployment d = deployments.next();
	    	
	    	System.out.println(d.getId());
	    	repositoryService.deleteDeployment(d.getId());
	    }*/
	    
	    System.out.println("*********************************************************************************");
	    //if (deploymentList == null || deploymentList.isEmpty()) {
	      repositoryService.createDeployment()
	        .name(deploymentName)
	        /*
	        .addClasspathResource("\\processes\\Personal_Info_Incomplete_Process_Bulk.bpmn")
	        .addClasspathResource("\\processes\\Medical_Info_Incomplete_Process_Bulk.bpmn")
	        .addClasspathResource("\\processes\\Passport_Info_Incomplete_Process_Bulk.bpmn")
	        .addClasspathResource("\\processes\\Emergency_Info_Incomplete_Process_Bulk.bpmn")
	        .addClasspathResource("\\processes\\Skills_Info_Incomplete_Process_Bulk.bpmn")
	        .addClasspathResource("\\processes\\Certifications_Info_Incomplete_Process_Bulk.bpmn")
	        
	        .addClasspathResource("\\processes\\HR_Unverified_Records_Remainder_Process_Bulk.bpmn")*/
	        
	        .addClasspathResource("1.1ems_employee_parent_process.bpmn")
	        .addClasspathResource("1.2ems_employee_creation_process.bpmn")
	        .addClasspathResource("1.2ems_employee_update_notification_process.bpmn")
	        .addClasspathResource("1.2ems_employee_skill_verification_process.bpmn")
	        .addClasspathResource("1.2ems_employee_certification_verification_process.bpmn")
	        .addClasspathResource("1.2ems_employee_skill_remainder_process.bpmn")
	        .addClasspathResource("1.1ems_employee_probation_process.bpmn")
	        .addClasspathResource("1.2ems_employee_probation_process.bpmn")
	        .addClasspathResource("1.2ems_employee_termination_remainder_process.bpmn")
	        .addClasspathResource("1.2ems_employee_termination_process.bpmn")
	        .deploy();
	    //}
	  }
}
