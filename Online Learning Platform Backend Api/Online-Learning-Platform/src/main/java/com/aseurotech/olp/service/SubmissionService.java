package com.aseurotech.olp.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.aseurotech.olp.payload.response.ApiResponse;
import com.aseurotech.olp.payload.response.SubmissionResponse;

public interface SubmissionService {
	
	ApiResponse<String> submission(MultipartFile file,long userId,long assignmentId);
	ApiResponse<List<SubmissionResponse>> submissionList(long assignmentId);
	ApiResponse<String> assignGrade(long submissionId,int grade);

}
