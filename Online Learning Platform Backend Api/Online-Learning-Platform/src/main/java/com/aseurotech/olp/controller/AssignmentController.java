package com.aseurotech.olp.controller;

import java.util.List;

import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aseurotech.olp.constants.AppConstants;
import com.aseurotech.olp.payload.request.AssignmentRequest;
import com.aseurotech.olp.payload.response.ApiResponse;import com.aseurotech.olp.payload.response.AssignmentResponse;
import com.aseurotech.olp.service.AssignmentService;

@RestController
@RequestMapping("/api/olp/assignment")
@CrossOrigin(origins = "http://localhost:3000")
public class AssignmentController {
	
	private final AssignmentService assignmentService;

	public AssignmentController(AssignmentService assignmentService) {
		super();
		this.assignmentService = assignmentService;
	}
	
	@PostMapping("/add-assignment")
	public ResponseEntity<ApiResponse<String>> addAssignment(@RequestBody AssignmentRequest request){
		ApiResponse<String> response = assignmentService.addAssignment(request);
		return new ResponseEntity<>(response,HttpStatusCode.valueOf(response.getStatus()));
	}
	
	@GetMapping("/assignment-list")
	public ResponseEntity<ApiResponse<List<AssignmentResponse>>> assignmentList(
			@RequestParam(defaultValue = AppConstants.PAGE_NUMBER) int pageNumber,
			@RequestParam(defaultValue = AppConstants.PAGE_SIZE) int pageSize
			,@RequestParam long courseId){
		ApiResponse<List<AssignmentResponse>> response = assignmentService.assignmentList(pageNumber,pageSize,courseId);
		return new ResponseEntity<>(response,HttpStatusCode.valueOf(response.getStatus()));
	}
	
	@GetMapping("/get-assignment")
	public ResponseEntity<ApiResponse<AssignmentResponse>> getAssignment(@RequestParam long assignmentId,@RequestParam long courseId){
		ApiResponse<AssignmentResponse> response = assignmentService.getAssignment(assignmentId, courseId);
		return new ResponseEntity<>(response,HttpStatusCode.valueOf(response.getStatus()));
	}
	

	
	

}
