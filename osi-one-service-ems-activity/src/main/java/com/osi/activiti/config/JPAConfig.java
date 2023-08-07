package com.osi.activiti.config;

import java.beans.PropertyVetoException;
import java.util.HashMap;
import java.util.Map;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.instrument.classloading.InstrumentationLoadTimeWeaver;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import com.mchange.v2.c3p0.ComboPooledDataSource;

/**
 * entity manager for JPA
 * @author vbalne
 *
 */
@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(basePackages = "com.osi.ems.repository")
public class JPAConfig {
	
	  @Autowired
	  private Environment environment;
	  
	    private static final String PROPERTY_NAME_DATABASE_DRIVER = "jdbc.driverClassName";		
		private static final String PROPERTY_NAME_DATABASE_URL = "jdbc.url";
		private static final String PROPERTY_NAME_DATABASE_USERNAME = "jdbc.username";
		private static final String PROPERTY_NAME_DATABASE_PASSWORD = "jdbc.password";
		
		private static final String PROPERTY_NAME_DATABASE_ACQUIRE_INC = "jdbc.acquireIncrement";
		private static final String PROPERTY_NAME_DATABASE_IDLE_CONNECTION = "jdbc.idleConnectionTestPeriod";
		private static final String PROPERTY_NAME_DATABASE_MAXPOOL = "jdbc.maxPoolSize";
		private static final String PROPERTY_NAME_DATABASE_MINPOOL = "jdbc.minPoolSize";
		private static final String PROPERTY_NAME_DATABASE_MAXSTATEMEMTS = "jdbc.maxStatements";
		private static final String PROPERTY_NAME_DATABASE_MAXSTATEMEMTS_PERCONN = "jdbc.maxStatementsPerConnection";

	   /* private static final String PROPERTY_NAME_HIBERNATE_DIALECT = "hibernate.dialect";
	    private static final String PROPERTY_NAME_HIBERNATE_FORMAT_SQL = "hibernate.format_sql";
	    private static final String PROPERTY_NAME_HIBERNATE_HBM2DDL_AUTO = "hibernate.hbm2ddl.auto";
	    private static final String PROPERTY_NAME_HIBERNATE_NAMING_STRATEGY = "hibernate.ejb.naming_strategy";
	    private static final String PROPERTY_NAME_HIBERNATE_SHOW_SQL = "hibernate.show_sql";*/
		
		private static final String PROPERTY_PACKAGES_TO_SCAN = "com.osi.ems.domain";

	
    @Bean(name = "dataSource", destroyMethod = "close")
    public ComboPooledDataSource dataSource() throws IllegalStateException, PropertyVetoException {
        ComboPooledDataSource dataSource = new ComboPooledDataSource();
        dataSource.setDriverClass(environment.getRequiredProperty(PROPERTY_NAME_DATABASE_DRIVER));
        dataSource.setJdbcUrl(environment.getRequiredProperty(PROPERTY_NAME_DATABASE_URL));
        dataSource.setUser(environment.getRequiredProperty(PROPERTY_NAME_DATABASE_USERNAME));
        dataSource.setPassword(environment.getRequiredProperty(PROPERTY_NAME_DATABASE_PASSWORD));
        dataSource.setAcquireIncrement(Integer.parseInt(environment.getRequiredProperty(PROPERTY_NAME_DATABASE_ACQUIRE_INC)));
        dataSource.setIdleConnectionTestPeriod(Integer.parseInt(environment.getRequiredProperty(PROPERTY_NAME_DATABASE_IDLE_CONNECTION)));
        dataSource.setMaxPoolSize(Integer.parseInt(environment.getRequiredProperty(PROPERTY_NAME_DATABASE_MAXPOOL)));        
        dataSource.setMinPoolSize(Integer.parseInt(environment.getRequiredProperty(PROPERTY_NAME_DATABASE_MINPOOL)));
        dataSource.setMaxStatements(Integer.parseInt(environment.getRequiredProperty(PROPERTY_NAME_DATABASE_MAXSTATEMEMTS)));
        dataSource.setMaxStatementsPerConnection((Integer.parseInt(environment.getRequiredProperty(PROPERTY_NAME_DATABASE_MAXSTATEMEMTS_PERCONN))));
        return dataSource;
    }
	
    /*@Autowired
	private DataSource dataSource;*/

    @Bean(name = "entityManagerFactory")
    public LocalContainerEntityManagerFactoryBean entityManagerFactory(
            @Value("${hibernate.show_sql}") String showSql,
            @Value("${hibernate.jdbc.batch_size}") String batchSize,
            @Value("${hibernate.jdbc.fetch_size}") String fetchSize,
            @Value("${hibernate.max_fetch_depth}") String maxFetchDepth,
            @Value("${hibernate.order_updates}") String orderUpdates,
            @Value("${hibernate.order_inserts}") String orderInserts,
            @Value("${domainPackagesToScan}") String domain,
            @Value("${hibernate.dialect}") String dialect,
            DataSource dataSource) {
        LocalContainerEntityManagerFactoryBean entityManagerFactoryBean =
                new LocalContainerEntityManagerFactoryBean();

        entityManagerFactoryBean.setDataSource(dataSource);
        entityManagerFactoryBean.setPackagesToScan(PROPERTY_PACKAGES_TO_SCAN);
        entityManagerFactoryBean.setLoadTimeWeaver(new InstrumentationLoadTimeWeaver());
        entityManagerFactoryBean.setJpaVendorAdapter(new HibernateJpaVendorAdapter());

        Map<String, Object> jpaProperties = new HashMap<String, Object>();
        //jpaProperties.put("hibernate.hbm2ddl.auto", hbm2ddl);
        jpaProperties.put("hibernate.show_sql", showSql);
        jpaProperties.put("hibernate.jdbc.batch_size", batchSize);
        jpaProperties.put("hibernate.jdbc.fetch_size", fetchSize);
        jpaProperties.put("hibernate.max_fetch_depth", maxFetchDepth);
        jpaProperties.put("hibernate.order_updates", orderUpdates);
        jpaProperties.put("hibernate.order_inserts", orderInserts);
        jpaProperties.put("hibernate.dialect", dialect);
        jpaProperties.put("hibernate.id.new_generator_mappings", false);
        entityManagerFactoryBean.setJpaPropertyMap(jpaProperties);

        return entityManagerFactoryBean;
    }
}
