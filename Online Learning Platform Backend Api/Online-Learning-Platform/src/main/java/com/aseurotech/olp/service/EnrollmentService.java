package com.aseurotech.olp.service;

import com.aseurotech.olp.payload.response.ApiResponse;

public interface EnrollmentService {
	
	ApiResponse<String> enroll(long courseId,long userId);
	ApiResponse<String> handlePaymentSuccess(String sessionId);

}
