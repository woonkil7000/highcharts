package com.example.practice_library.service;

import com.example.practice_library.model.ChartData;
import com.example.practice_library.model.repository.ChartDataRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
@Slf4j
@Service
@RequiredArgsConstructor
public class ChartDataService {
    
    private final ChartDataRepository chartDataRepository;
    
    public List<ChartData> findAll() {
        return chartDataRepository.findAll();
    }

    public List<ChartData> findSome() {
        return chartDataRepository.chartDataList2();
    }

    public Map<String, Object> dataJson () {
        Map<String, Object> data = new HashMap<>();
        data.put("data", chartDataRepository.chartDataList());

        log.info(" @@@@ ChartDataService data='{}'",data);
        return data;
    }
}
