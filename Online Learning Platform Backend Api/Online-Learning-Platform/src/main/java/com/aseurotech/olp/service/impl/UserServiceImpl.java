package com.aseurotech.olp.service.impl;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.aseurotech.olp.entity.User;
import com.aseurotech.olp.entity.UserRole;
import com.aseurotech.olp.payload.request.SignInRequest;
import com.aseurotech.olp.payload.request.SignUpRequest;
import com.aseurotech.olp.payload.response.ApiResponse;
import com.aseurotech.olp.payload.response.UserResponse;
import com.aseurotech.olp.repository.RoleRepository;
import com.aseurotech.olp.repository.UserRepository;
import com.aseurotech.olp.service.JwtService;
import com.aseurotech.olp.service.UserService;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService{
	
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final RoleRepository roleRepository;
	private final AuthenticationManager authenticationManager;
	private final JwtService jwtService;
	


	public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, RoleRepository roleRepository, AuthenticationManager authenticationManager, JwtService jwtService) {
		super();
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.roleRepository = roleRepository;
		this.authenticationManager = authenticationManager;
		this.jwtService = jwtService;
	}


	@Override
	public ApiResponse<String> singUp(SignUpRequest request) {
		ApiResponse<String> response=new ApiResponse<String>();
		
		if(userRepository.existsByUsername(request.getUsername())) {
			response.setMessage("Signup failed");
			response.setData("User with username "+request.getUsername()+" is alrady exists");
			response.setStatus(500);
			return response;
		}
		
		if(userRepository.existsByEmail(request.getEmail())) {
			response.setMessage("Signup failed");
			response.setData("User with email "+request.getEmail()+" is alrady exists");
			response.setStatus(500);
			return response;
		}
		
		User user =new User();
		user.setUsername(request.getUsername());
		user.setEmail(request.getEmail());
		user.setPassword(passwordEncoder.encode(request.getPassword()));
		
		UserRole userRole=new UserRole();
		
		if(request.getRole().equalsIgnoreCase("Admin")) {
			userRole.setRole(roleRepository.findById(1l).orElseThrow(()-> new RuntimeException("Role not found")));
		}else if(request.getRole().equalsIgnoreCase("Instructor")) {
			userRole.setRole(roleRepository.findById(2l).orElseThrow(()-> new RuntimeException("Role not found")));
			
		}else {
			userRole.setRole(roleRepository.findById(3l).orElseThrow(()-> new RuntimeException("Role not found")));
		}
		
		userRole.setUser(user);
		
		user.getUserRoles().add(userRole);
		User savedUser = userRepository.save(user);
		
		if(savedUser!=null) {
			response.setMessage("User signup process completed");
			response.setData(savedUser.getUsername()+" your singup is successfully completed");
			response.setStatus(201);
			return response;
		}
		
		response.setMessage("User signup process failed");
		response.setData("Error during singup process");
		response.setStatus(500);
		return response;
	}


	@Override
	public ApiResponse<String> signIn(SignInRequest request) {
		ApiResponse<String> response=new ApiResponse<String>();
		
		try {
			UsernamePasswordAuthenticationToken authToken=
					new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword());
			Authentication authenticate = authenticationManager.authenticate(authToken);
			if(authenticate.isAuthenticated()) {
				String token = jwtService.generateToken(request.getUsername(), 
						authenticate.getAuthorities().iterator().next().getAuthority());
				
				response.setMessage("Sign in success");
				response.setData(token);
				response.setStatus(200);
				return response;
			}
			
		}catch (BadCredentialsException e) {
			response.setMessage("Sign in failed");
			response.setData("Invalid Credentials");
			response.setStatus(401);
			return response;
			
		}
		
		response.setMessage("Sign in failed");
		response.setData("Error during sign in process");
		response.setStatus(500);
		return response;
	}


	@Override
	public ApiResponse<UserResponse> getUser(String username) {
		ApiResponse<UserResponse> response=new ApiResponse<UserResponse>();
		UserResponse userResponse=new UserResponse();
		User user = userRepository.findByUsername(username).orElseThrow(()-> new RuntimeException("User data not found"));
		userResponse.setUsername(user.getUsername());
		userResponse.setEmail(user.getEmail());
		userResponse.setId(user.getId());
		
		response.setMessage("User details");
		response.setData(userResponse);
		response.setStatus(200);

		return response;
	}


	@Override
	public ApiResponse<String> getRole(String token) {
		ApiResponse<String> response=new ApiResponse<String>();
		String role = jwtService.validateAndRetrieveRole(token);
		response.setMessage("Current user role");
		response.setData(role);
		response.setStatus(200);
		return response;
	}

	@Override
	public ApiResponse<List<UserResponse>> getInstructors() {
		ApiResponse<List<UserResponse>> response = new ApiResponse<>();

		try {
			// 1️⃣ Fetch users having role "INSTRUCTOR"
			List<User> instructors = userRepository.findUsersByRoleName("INSTRUCTOR");

			// 2️⃣ Convert entities to DTO
			List<UserResponse> instructorResponses = instructors.stream()
					.map(user -> {
						UserResponse dto = new UserResponse();
						dto.setId(user.getId());
						dto.setUsername(user.getUsername());
						dto.setEmail(user.getEmail());
						return dto;
					})
					.collect(Collectors.toList());

			// 3️⃣ Prepare success response
			response.setStatus(200);
			response.setMessage("List of instructors fetched successfully.");
			response.setData(instructorResponses);

		} catch (Exception e) {
			e.printStackTrace();
			response.setStatus(500);
			response.setMessage("Error while fetching instructors: " + e.getMessage());
			response.setData(Collections.emptyList());
		}

		return response;
	}

	@Override
	public ApiResponse<List<UserResponse>> getStudents() {
		ApiResponse<List<UserResponse>> response = new ApiResponse<>();

		try {
			// 1️⃣ Fetch users having role "INSTRUCTOR"
			List<User> students = userRepository.findUsersByRoleName("STUDENT");

			// 2️⃣ Convert entities to DTO
			List<UserResponse> studentResponses = students.stream()
					.map(user -> {
						UserResponse dto = new UserResponse();
						dto.setId(user.getId());
						dto.setUsername(user.getUsername());
						dto.setEmail(user.getEmail());
						return dto;
					})
					.collect(Collectors.toList());

			// 3️⃣ Prepare success response
			response.setStatus(200);
			response.setMessage("List of instructors fetched successfully.");
			response.setData(studentResponses);

		} catch (Exception e) {
			e.printStackTrace();
			response.setStatus(500);
			response.setMessage("Error while fetching instructors: " + e.getMessage());
			response.setData(Collections.emptyList());
		}

		return response;
	}

	@Override
	public ApiResponse<String> deleteUser(long userId) {
		ApiResponse<String> response=new ApiResponse<>();
		try{
			User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User data not found"));
			userRepository.delete(user);
			response.setMessage("User deletion success");
			response.setData("User has been deleted for id "+userId);
			response.setStatus(200);
			return response;
		}catch (Exception e){
			response.setMessage("User deletion failed");
			response.setData("Error during user deletion process");
			response.setStatus(500);
			return response;
		}

	}


}
