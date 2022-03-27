package com.example.practice_library.controller;

import com.example.practice_library.dto.CMRespDto;
import com.example.practice_library.model.ChartData;
import com.example.practice_library.service.ChartDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/")
public class DefaultController {
    
    private final ChartDataService chartDataService;

    /*@GetMapping("/chart")
    public ModelAndView chartData() {
        ModelAndView mv = new ModelAndView("/chart");
        List<ChartData> all = chartDataService.findAll();
        mv.addObject("list", all);
        return mv;
    }*/

    @GetMapping("/apiChartData")
    public ResponseEntity<?> apiChartData() {
        List<ChartData> some = chartDataService.findSome();
        return new ResponseEntity<>(new CMRespDto<>(1, "List ChartData 담기 성공", some), HttpStatus.OK);
    }
    
    @GetMapping("/jsonTest")
    public Map<String, Object> jsonTest() {
        return chartDataService.dataJson();
    }
}
