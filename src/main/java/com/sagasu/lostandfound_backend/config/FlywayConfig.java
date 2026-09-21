package com.sagasu.lostandfound_backend.config;

import org.flywaydb.core.Flyway;
import org.springframework.beans.factory.config.BeanFactoryPostProcessor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration
public class FlywayConfig {

    @Bean
    public Flyway flyway(DataSource dataSource) {
        Flyway flyway = Flyway.configure()
                .dataSource(dataSource)
                .locations("classpath:db/migration")
                .baselineOnMigrate(true)
                .cleanDisabled(false)
                .load();

        // Tự động xóa sạch toàn bộ DB (clean) và chạy lại migration từ đầu (migrate)
        // mỗi khi ứng dụng khởi động lại, giúp dữ liệu luôn được reset về seed data ban đầu.
        flyway.clean();
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
