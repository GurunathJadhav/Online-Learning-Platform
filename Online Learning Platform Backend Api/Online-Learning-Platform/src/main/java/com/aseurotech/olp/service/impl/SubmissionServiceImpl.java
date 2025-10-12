package com.aseurotech.olp.service.impl;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.aseurotech.olp.entity.Assignment;
import com.aseurotech.olp.entity.Course;
import com.aseurotech.olp.entity.Submission;
import com.aseurotech.olp.entity.User;
import com.aseurotech.olp.payload.response.ApiResponse;
import com.aseurotech.olp.payload.response.SubmissionResponse;
import com.aseurotech.olp.repository.AssignmentRepository;
import com.aseurotech.olp.repository.EnrollmentRepository;
import com.aseurotech.olp.repository.SubmissionRepository;
import com.aseurotech.olp.repository.UserRepository;
import com.aseurotech.olp.service.SubmissionService;

@Service
public class SubmissionServiceImpl implements SubmissionService {
	
	private final SubmissionRepository submissionRepository;
	private final AssignmentRepository assignmentRepository;
	private final UserRepository userRepository;
	private final EnrollmentRepository enrollmentRepository;
	
	public SubmissionServiceImpl(SubmissionRepository submissionRepository,
			UserRepository userRepository, AssignmentRepository assignmentRepository, EnrollmentRepository enrollmentRepository) {
		super();
		this.submissionRepository = submissionRepository;
		this.assignmentRepository = assignmentRepository;
		
		this.userRepository = userRepository;
		this.enrollmentRepository = enrollmentRepository;
	}


	@Override
	public ApiResponse<String> submission(MultipartFile file, long userId, long assignmentId) {
	    ApiResponse<String> response = new ApiResponse<>();

	    try {
	        Assignment assignment = assignmentRepository.findById(assignmentId)
	            .orElseThrow(() -> new RuntimeException("Assignment not found"));

	        Course course = assignment.getCourse();
	        boolean isEnrolled = enrollmentRepository.existsByUserIdAndCourseId(userId, course.getId());
	        if (!isEnrolled) {
	            throw new RuntimeException("User is not enrolled in the course for this assignment");
	        }
	        User user = userRepository.findById(userId)
	            .orElseThrow(() -> new RuntimeException("User not found"));

	        String fileContent = new String(file.getBytes(), StandardCharsets.UTF_8);

	        Submission submission = new Submission();
	        submission.setAssignment(assignment);
	        submission.setUser(user);
	        submission.setContent(fileContent);

	        submissionRepository.save(submission);

	        response.setMessage("Assessment submitted");
	        response.setData("Assessment submitted for: " + assignment.getTitle());
	        response.setStatus(201);

	    } catch (Exception e) {
	        response.setMessage("Assessment submission failed");
	        response.setData("Error: " + e.getMessage());
	        response.setStatus(500);
	    }

	    return response;
	}



	@Override
	public ApiResponse<List<SubmissionResponse>> submissionList(long assignmentId) {
		
		ApiResponse<List<SubmissionResponse>> response=new ApiResponse<List<SubmissionResponse>>();

		List<Submission> submissions = submissionRepository.findAllByAssignmentId(assignmentId);
		
		List<SubmissionResponse> submissionList = submissions.stream().map(submission->{
			SubmissionResponse submissionResponse=new SubmissionResponse();
			submissionResponse.setId(submission.getId());
			submissionResponse.setContent(submission.getContent());
			submissionResponse.setUserId(submission.getUser().getId());
			submissionResponse.setUsername(submission.getUser().getUsername());
			submissionResponse.setAssignmentTitle(submission.getAssignment().getDescription());
			submissionResponse.setCourseTitle(submission.getAssignment().getCourse().getTitle());
			submissionResponse.setGrade(submission.getGrade() != null ? submission.getGrade() : 0);


			return submissionResponse;
		}).collect(Collectors.toList());
		
		response.setMessage("Submission List");
		response.setData(submissionList);
		response.setStatus(200);
		return response;
	}

	@Override
	public ApiResponse<String> assignGrade(long submissionId, int grade) {
		ApiResponse<String> response=new ApiResponse<>();
		Submission submission = submissionRepository.findById(submissionId).orElseThrow(() -> new RuntimeException("Submission data not found"));
		submission.setGrade(grade);
		Submission saved = submissionRepository.save(submission);
		if(saved!=null){
			response.setMessage("Grade Assigning success");
			response.setData("Grade has been assigned for submission "+submissionId);
			response.setStatus(200);
			return response;
		}
		response.setMessage("Grade Assigning Failed");
		response.setData("Error during assigning grade");
		response.setStatus(500);
		return response;
	}

}
