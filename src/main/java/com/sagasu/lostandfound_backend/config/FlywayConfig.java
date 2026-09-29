package com.sagasu.lostandfound_backend.config;

import org.flywaydb.core.Flyway;
import org.springframework.beans.factory.config.BeanFactoryPostProcessor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.TimeZone;

import javax.sql.DataSource;

@Configuration
public class FlywayConfig {

    static {
        if ("Asia/Saigon".equals(TimeZone.getDefault().getID())) {
            TimeZone.setDefault(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
        }
    }

    @Bean
    public Flyway flyway(DataSource dataSource) {
        Flyway flyway = Flyway.configure()
                .dataSource(dataSource)
                .locations("classpath:db/migration")
                .baselineOnMigrate(true)
                .cleanDisabled(true)
                .load();

        flyway.migrate();
        return flyway;
    }

    @Bean
    public static BeanFactoryPostProcessor dependsOnPostProcessor() {
        return registry -> {
            for (String name : registry.getBeanDefinitionNames()) {
                if ("entityManagerFactory".equalsIgnoreCase(name)) {
                    registry.getBeanDefinition(name).setDependsOn("flyway");
                }
            }
        };
    }
}
