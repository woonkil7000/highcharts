package com.example.practice_library.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "CHART_DATA")
public class ChartData {
    
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "chart_seq")
    @SequenceGenerator(name = "chart_seq", sequenceName = "chart_seq", allocationSize = 1)
    @Column(name = "pid", nullable = false)
    private int pid;
    
    @Column(name = "data", length = 2)
    private int data;
    

    
}
