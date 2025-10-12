package com.aseurotech.olp.controller;

import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.aseurotech.olp.payload.request.SignInRequest;
import com.aseurotech.olp.payload.request.SignUpRequest;
import com.aseurotech.olp.payload.response.ApiResponse;
import com.aseurotech.olp.payload.response.UserResponse;
import com.aseurotech.olp.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/olp/auth")
@CrossOrigin(origins = "http://localhost:300")
public class AuthController {
	
	private final UserService userService;

	public AuthController(UserService userService) {
		super();
		this.userService = userService;
	}
	
	@PostMapping("/signup")
	public ResponseEntity<ApiResponse<String>> userSignUp(@RequestBody SignUpRequest request){
		ApiResponse<String> response = userService.singUp(request);
		return new ResponseEntity<>(response,HttpStatusCode.valueOf(response.getStatus()));
	}
	
	@PostMapping("/signin")
	public ResponseEntity<ApiResponse<String>> userSignIn(@RequestBody SignInRequest request){
		ApiResponse<String> response = userService.signIn(request);
		return new ResponseEntity<>(response,HttpStatusCode.valueOf(response.getStatus()));
	}
	
	@GetMapping("/get-user")
	public ResponseEntity<ApiResponse<UserResponse>> getUser(@AuthenticationPrincipal UserDetails user){
		ApiResponse<UserResponse> response = userService.getUser(user.getUsername());
		return new ResponseEntity<>(response,HttpStatusCode.valueOf(response.getStatus()));
	}
	
	@GetMapping("/get-role")
	public ResponseEntity<ApiResponse<String>> getRole(@RequestParam String token){
		ApiResponse<String> response = userService.getRole(token);
		return new ResponseEntity<>(response,HttpStatusCode.valueOf(response.getStatus()));
	}

	@GetMapping("/instructor-list")
	public ResponseEntity<ApiResponse<List<UserResponse>>> getInstructors(){
		ApiResponse<List<UserResponse>> response = userService.getInstructors();
		return new ResponseEntity<>(response,HttpStatusCode.valueOf(response.getStatus()));

	}

	@GetMapping("/student-list")
	public ResponseEntity<ApiResponse<List<UserResponse>>> getStudents(){
		ApiResponse<List<UserResponse>> response = userService.getStudents();
		return new ResponseEntity<>(response,HttpStatusCode.valueOf(response.getStatus()));
	}

	@DeleteMapping("/delete-user")
	public ResponseEntity<ApiResponse<String>> deleteUser(@RequestParam long userId){
		ApiResponse<String> response = userService.deleteUser(userId);
		return new ResponseEntity<>(response,HttpStatusCode.valueOf(response.getStatus()));
	}

}
