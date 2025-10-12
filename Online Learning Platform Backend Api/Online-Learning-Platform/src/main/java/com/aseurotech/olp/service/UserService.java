package com.aseurotech.olp.service;

import com.aseurotech.olp.payload.request.SignInRequest;
import com.aseurotech.olp.payload.request.SignUpRequest;
import com.aseurotech.olp.payload.response.ApiResponse;
import com.aseurotech.olp.payload.response.UserResponse;

import java.util.List;

public interface UserService {
	
	ApiResponse<String> singUp(SignUpRequest request);
	ApiResponse<String> signIn(SignInRequest request);
	ApiResponse<UserResponse> getUser(String username);
	ApiResponse<String> getRole(String token);
	ApiResponse<List<UserResponse>> getInstructors();
	ApiResponse<List<UserResponse>> getStudents();
	ApiResponse<String> deleteUser(long userId);

}
