package com.osi.activiti.config;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.PropertySource;

/**
 * Spring boot application Initializer
 * @author smanchala
 *
 */
@EnableAutoConfiguration
@ComponentScan(basePackages = {"com.osi.activiti","org.activiti.rest.service.api.runtime.process","com.osi.ems"})
//@Import({ ActivitiConfig.class,ActivitiInit.class,JPAConfig.class,TransactionConfig.class,CacheConfig.class,ServiceConfig.class})
@PropertySource({"classpath:db.properties", "classpath:resources.properties", "classpath:errorOrSuccessMsg.properties"})
@SpringBootApplication
public class Application /*extends SpringBootServletInitializer*/{
	
	/*@Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(Application.class);
    }*/
	
	public static void main(String args[]) {
		System.out.println("############# Start ####################");
        SpringApplication.run(Application.class, args);
        System.out.println("############# End ####################");
    }
}
