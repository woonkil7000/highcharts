package com.example.practice_library.controller;

import com.example.practice_library.service.ChartDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;

@RequiredArgsConstructor
@Controller
public class ChartController {
    private final ChartDataService chartDataService;

    @GetMapping("/")
    public String index() {
        return "/index";
    }
    @GetMapping("/chart2")
    public String chart2() {
        return "chart2";
    }
    @GetMapping("/chart3")
    public String chart3() {
        return "chart3";
    }
    @GetMapping("/chart4")
    public String chart4() {
        return "chart4";
    }

    /*@GetMapping("/chart")
    public ModelAndView chartData() {
        ModelAndView mv = new ModelAndView("/chart");
        List<ChartData> all = chartDataService.findAll();
        mv.addObject("list", all);
        return mv;
    }*/
}
