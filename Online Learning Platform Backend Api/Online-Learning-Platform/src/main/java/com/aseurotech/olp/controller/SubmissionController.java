package com.aseurotech.olp.controller;

import java.util.List;

import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.aseurotech.olp.payload.response.ApiResponse;
import com.aseurotech.olp.payload.response.SubmissionResponse;
import com.aseurotech.olp.service.SubmissionService;

@RestController
@RequestMapping("/api/olp/submission")
@CrossOrigin(origins = "http://localhost:3000")
public class SubmissionController {
	
	private final SubmissionService submissionService;

	public SubmissionController(SubmissionService submissionService) {
		super();
		this.submissionService = submissionService;
	}
	
	@PostMapping("/submit-assessment")
	public ResponseEntity<ApiResponse<String>> submitAssessment(
			@RequestParam MultipartFile file,
			@RequestParam long userId, @RequestParam long assignmentId){
		ApiResponse<String> response = submissionService.submission(file,userId,assignmentId);
		return new ResponseEntity<>(response,HttpStatusCode.valueOf(response.getStatus()));
	}
	
	@GetMapping("/submission-list")
	public ResponseEntity<ApiResponse<List<SubmissionResponse>>> submissionList(@RequestParam long assignmentId){
		ApiResponse<List<SubmissionResponse>> response = submissionService.submissionList(assignmentId);
		return new ResponseEntity<>(response,HttpStatusCode.valueOf(response.getStatus()));
	}

	@PutMapping("/assign-grade")
	public ResponseEntity<ApiResponse<String>> assignGrade(@RequestParam long submissionId,@RequestParam int grade){
		ApiResponse<String> response = submissionService.assignGrade(submissionId, grade);
		return new ResponseEntity<>(response,HttpStatusCode.valueOf(response.getStatus()));
	}

}
