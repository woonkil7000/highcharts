package com.example.practice_library;

import com.example.practice_library.model.ChartData;
import com.example.practice_library.model.repository.ChartDataRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import java.util.Random;

@SpringBootTest
@EnableJpaRepositories
class PracticeLibraryApplicationTests {
    
    @Autowired
    ChartDataRepository chartDataRepository;
    
    @Test
    void contextLoads() {
    }
    
    @Test
    void insertRandomDB() {
        for (int i = 0; i < 50; i++) {
            
            chartDataRepository.save(
                    ChartData.builder()
                            .data((int)(Math.random()*99))
                            .build()
            );
            
        }
    }
    
    
}
