package com.osi.activiti.config;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ResourceBundle;

import javax.sql.DataSource;

import org.activiti.engine.FormService;
import org.activiti.engine.HistoryService;
import org.activiti.engine.IdentityService;
import org.activiti.engine.ManagementService;
import org.activiti.engine.ProcessEngine;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.delegate.event.ActivitiEventListener;
import org.activiti.engine.delegate.event.ActivitiEventType;
import org.activiti.engine.impl.cfg.ProcessEngineConfigurationImpl;
import org.activiti.engine.impl.history.HistoryLevel;
import org.activiti.spring.ProcessEngineFactoryBean;
import org.activiti.spring.SpringProcessEngineConfiguration;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;


/**
 * process engine configuration for activiti
 * @author vbalne
 *
 */
@Configuration
public class ActivitiConfig {
	private Log logger = LogFactory.getLog(getClass());

	@Autowired
	private DataSource dataSource;
	
	@Value("${activiti.history.flag}")
	private String historyFlag;

	@Autowired
	private PlatformTransactionManager transactionManager;
	private ResourceBundle bundle = ResourceBundle.getBundle("resources");

	@Bean
	public ProcessEngine processEngine(
			ProcessEngineConfigurationImpl processEngineConfigurationImpl,
			ApplicationContext applicationContext) throws Exception {
		ProcessEngineFactoryBean processEngineFactoryBean = new ProcessEngineFactoryBean();
		processEngineFactoryBean.setProcessEngineConfiguration(processEngineConfigurationImpl);
		processEngineFactoryBean.setApplicationContext(applicationContext);
		return processEngineFactoryBean.getObject();
	}
	
	@Bean(name = "processEngineConfiguration")
	public SpringProcessEngineConfiguration processEngineConfiguration() {
		
		String from = bundle.getString("error.email.from");
		String fromName = bundle.getString("error.email.username");
		String password = bundle.getString("error.email.password");
		String host = bundle.getString("error.email.host");
		String port = bundle.getString("error.email.port");
		System.out.println(from+" : "+fromName+" : "+password+" : "+host+" : "+port);
		
		SpringProcessEngineConfiguration processEngineConfiguration = new SpringProcessEngineConfiguration();
		processEngineConfiguration.setDataSource(dataSource);
		processEngineConfiguration.setDatabaseSchemaUpdate("true");
		processEngineConfiguration.setTransactionManager(transactionManager);
		processEngineConfiguration.setJobExecutorActivate(true);
		processEngineConfiguration.setAsyncExecutorEnabled(true);
		processEngineConfiguration.setAsyncExecutorActivate(true);
		//processEngineConfiguration.setHistoryLevel(HistoryLevel.NONE);// default is :AUDIT
		//processEngineConfiguration.setHistoryLevel(HistoryLevel.AUDIT);
		processEngineConfiguration.setHistoryLevel(HistoryLevel.getHistoryLevelForKey(historyFlag));

		
		processEngineConfiguration.setMailServerHost(host.toString());
		processEngineConfiguration.setMailServerPort(Integer.parseInt(port));
		processEngineConfiguration.setMailServerUsername(fromName.toString());
		processEngineConfiguration.setMailServerPassword(password.toString());
		processEngineConfiguration.setMailServerUseSSL(false);
		processEngineConfiguration.setMailServerUseTLS(true);
		processEngineConfiguration.setMailServerDefaultFrom(from.toString());

		logger.info("###### set processEngineConfiguration for email configuration");
		// try{
		Map<String, List<ActivitiEventListener>> eventListeners = new HashMap<String, List<ActivitiEventListener>>();
		eventListeners
				.put(ActivitiEventType.PROCESS_STARTED.toString(),
						Arrays.asList((ActivitiEventListener) new ProcessStartEventListener()));
		// eventListeners.put(ActivitiEventType.ACTIVITY_STARTED.toString(),
		// Arrays.asList((ActivitiEventListener)new ProcessProgressListener()));
		// eventListeners.put(ActivitiEventType.ACTIVITY_COMPLETED.toString(),
		// Arrays.asList((ActivitiEventListener)new ProcessProgressListener()));
		// eventListeners.put(ActivitiEventType.PROCESS_CANCELLED.toString(),
		// Arrays.asList((ActivitiEventListener)new
		// ProcessCancelledListener()));
		processEngineConfiguration.setTypedEventListeners(eventListeners);
		/*
		 * } catch (IOException | TimeoutException e) {
		 * logger.error("Error while setting events listeners"); }
		 */
		logger.info("*** Setting up ProcessEngineConfiguration:: TypedEventListeners configured successfully");

		return processEngineConfiguration;
	}

	@Bean(name = "processEngineFactoryBean")
	public ProcessEngineFactoryBean processEngineFactoryBean() {
		ProcessEngineFactoryBean factoryBean = new ProcessEngineFactoryBean();
		factoryBean.setProcessEngineConfiguration(processEngineConfiguration());
		return factoryBean;
	}

	@Bean
	public RepositoryService repositoryService(ProcessEngine processEngine) {
		return processEngine.getRepositoryService();
	}

	@Bean
	public RuntimeService runtimeService(ProcessEngine processEngine) {
		return processEngine.getRuntimeService();
	}

	@Bean
	public TaskService taskService(ProcessEngine processEngine) {
		return processEngine.getTaskService();
	}

	@Bean
	public FormService formService(ProcessEngine processEngine) {
		return processEngine.getFormService();
	}

	@Bean
	public HistoryService historyService(ProcessEngine processEngine) {
		return processEngine.getHistoryService();
	}

	@Bean
	public ManagementService managementService(ProcessEngine processEngine) {
		return processEngine.getManagementService();
	}

	@Bean
	public IdentityService identityService(ProcessEngine processEngine) {
		return processEngine.getIdentityService();
	}
}
