package com.example.practice_library.model.repository;

import com.example.practice_library.model.ChartData;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ChartDataRepository extends JpaRepository<ChartData, Integer> {
    
    @Query(value = "select data from ChartData")
    List<Integer> chartDataList();
    
    
}
