package com.aseurotech.olp.controller;

import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aseurotech.olp.payload.request.ReviewRequest;
import com.aseurotech.olp.payload.response.ApiResponse;
import com.aseurotech.olp.service.ReviewService;

@RestController
@RequestMapping("/api/olp/review")
public class ReviewController {
	
	private final ReviewService reviewService;

	public ReviewController(ReviewService reviewService) {
		super();
		this.reviewService = reviewService;
	}
	
	@PostMapping("/add-review")
	public ResponseEntity<ApiResponse<String>> addReview(@RequestBody ReviewRequest request){
		ApiResponse<String> response = reviewService.addReview(request);
		return new ResponseEntity<>(response,HttpStatusCode.valueOf(response.getStatus()));
	}

}
