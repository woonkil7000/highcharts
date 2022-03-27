package com.example.practice_library.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CMRespDto<T> {
    //private int statusCode;
    private int code; //1성공, -1실패
    private String message;
    private T data;
}
