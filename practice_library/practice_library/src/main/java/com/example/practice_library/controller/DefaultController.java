package com.example.practice_library.controller;

import com.example.practice_library.model.ChartData;
import com.example.practice_library.service.ChartDataService;
import lombok.RequiredArgsConstructor;
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
    
    @GetMapping("/")
    public ModelAndView index() {
        return new ModelAndView("/index");
    }
    
    /*@GetMapping("/chart")
    public ModelAndView chartData() {
        ModelAndView mv = new ModelAndView("/chart");
        List<ChartData> all = chartDataService.findAll();
        mv.addObject("list", all);
        return mv;
    }*/
    @GetMapping("/chart2")
    public ModelAndView chartData() {
        ModelAndView mv = new ModelAndView("/chart2");
        List<ChartData> all = chartDataService.findSome();
        mv.addObject("list", all);
        return mv;
    }
    
    @GetMapping("/jsonTest")
    public Map<String, Object> jsonTest() {
        return chartDataService.dataJson();
    }
}
