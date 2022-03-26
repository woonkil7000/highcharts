package com.example.practice_library.model.repository;

import com.example.practice_library.model.ChartData;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ChartDataRepository extends JpaRepository<ChartData, Integer> {
    
    /*@Query(value = "select data from ChartData where rownum < 10")
    List<Integer> chartDataList();*/

    @Query(value = "select * from chart_data where rownum < 11",nativeQuery = true)
    List<Integer> chartDataList();

    @Query(value = "select * from chart_data where rownum < 11",nativeQuery = true)
    List<ChartData> chartDataList2();
    
}
