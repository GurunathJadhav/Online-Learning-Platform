package com.aseurotech.olp.service;

import com.aseurotech.olp.payload.request.ReviewRequest;
import com.aseurotech.olp.payload.response.ApiResponse;

public interface ReviewService {
	
	ApiResponse<String> addReview(ReviewRequest request);

}
