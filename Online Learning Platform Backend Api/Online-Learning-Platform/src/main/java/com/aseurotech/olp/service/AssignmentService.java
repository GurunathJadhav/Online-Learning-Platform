package com.aseurotech.olp.service;

import java.util.List;

import com.aseurotech.olp.payload.request.AssignmentRequest;
import com.aseurotech.olp.payload.response.ApiResponse;
import com.aseurotech.olp.payload.response.AssignmentResponse;

public interface AssignmentService {
	
	ApiResponse<String> addAssignment(AssignmentRequest request);
	ApiResponse<List<AssignmentResponse>> assignmentList(int pageNumber,int pageSize,long courseId);
	ApiResponse<AssignmentResponse> getAssignment(long assignmentId,long courseId);

}
