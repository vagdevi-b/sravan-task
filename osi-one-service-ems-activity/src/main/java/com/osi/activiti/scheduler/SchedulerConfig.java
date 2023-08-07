package com.osi.activiti.scheduler;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.SchedulingConfigurer;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.scheduling.config.ScheduledTaskRegistrar;

/**
 * Scheduler Configuration for FAS activiti flows
 * @author smanchala
 *
 */

@Configuration
@EnableScheduling
@PropertySource({"classpath:schedulerconfig.properties"})
public class SchedulerConfig implements SchedulingConfigurer {
	
	private final Logger LOGGER = LoggerFactory.getLogger(SchedulerConfig.class);	
	
		@Value("${thread.pool.size}")
		private String poolSize ; 
		
	    @Override
	    public void configureTasks(ScheduledTaskRegistrar taskRegistrar) {
	        taskRegistrar.setScheduler(scheduler());
	    }
	    
	    @Bean
	    public TaskScheduler scheduler() {
	    	LOGGER.info("@@@@ thread pool size :"+Integer.parseInt(poolSize));
	    	ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();
	    	scheduler.setPoolSize(Integer.parseInt(poolSize));
	    	//scheduler.setPoolSize(100);
	    	scheduler.afterPropertiesSet();
	    	return scheduler;
	    }
	     

	    @Bean
	    public SchedulerService service() {
	        return new SchedulerService();
	    }
	    
	    /*
	    @Bean
	    public EMSRuntimeServiceForExplorer runtimeServiceForExplorer() {
	    	return new EMSRuntimeServiceForExplorer();
	    }*/
	    
	    @Bean
		public static PropertySourcesPlaceholderConfigurer propertyConfigInDev() {
			return new PropertySourcesPlaceholderConfigurer();
		}
}