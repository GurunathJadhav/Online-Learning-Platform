package com.aseurotech.olp.exception;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.aseurotech.olp.payload.response.ApiResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {
	
	@ExceptionHandler(BadCredentialsException.class)
	public ApiResponse<String> handleBadCredentialsException(BadCredentialsException e){
		ApiResponse<String> response=new ApiResponse<String>();
		response.setMessage("Sign in failed");
		response.setData("Invalid Credentials");
		response.setStatus(401);
		return response;
	}
	
	@ExceptionHandler(RuntimeException.class)
	public ApiResponse<String> handleRuntimeException(RuntimeException e){
		ApiResponse<String> response=new ApiResponse<String>();
		response.setMessage("Something went wrong");
		response.setData(e.getLocalizedMessage());
		response.setStatus(500);
		return response;
	}

}
