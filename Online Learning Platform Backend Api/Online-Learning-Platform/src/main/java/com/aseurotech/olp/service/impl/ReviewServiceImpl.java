package com.aseurotech.olp.service.impl;

import org.springframework.stereotype.Service;

import com.aseurotech.olp.entity.Course;
import com.aseurotech.olp.entity.Review;
import com.aseurotech.olp.entity.User;
import com.aseurotech.olp.payload.request.ReviewRequest;
import com.aseurotech.olp.payload.response.ApiResponse;
import com.aseurotech.olp.repository.CourseRepository;
import com.aseurotech.olp.repository.EnrollmentRepository;
import com.aseurotech.olp.repository.ReviewRepository;
import com.aseurotech.olp.repository.UserRepository;
import com.aseurotech.olp.service.ReviewService;

@Service
public class ReviewServiceImpl implements ReviewService {
	
	private final ReviewRepository reviewRepository;
	private final UserRepository userRepository;
	private final EnrollmentRepository enrollmentRepository;
	private final CourseRepository courseRepository;
	

	public ReviewServiceImpl(ReviewRepository reviewRepository,
			UserRepository userRepository, EnrollmentRepository enrollmentRepository, CourseRepository courseRepository) {
		this.reviewRepository = reviewRepository;
		this.userRepository = userRepository;
		this.enrollmentRepository = enrollmentRepository;
		this.courseRepository = courseRepository;
	}


	@Override
	public ApiResponse<String> addReview(ReviewRequest request) {
	    ApiResponse<String> response = new ApiResponse<>();

	    try {
	        Course course = courseRepository.findById(request.getCourseId())
	            .orElseThrow(() -> new RuntimeException("Course not found"));

	        User user = userRepository.findById(request.getUserId())
	            .orElseThrow(() -> new RuntimeException("User not found"));

	        boolean isEnrolled = enrollmentRepository.existsByUserIdAndCourseId(user.getId(), course.getId());

	        if (!isEnrolled) {
	            throw new RuntimeException("User is not enrolled in the selected course");
	        }

	        Review review = new Review();
	        review.setComment(request.getComment());
	        review.setReating(request.getReating());
	        review.setCourse(course);
	        review.setUser(user);

	        Review savedReview = reviewRepository.save(review);

	        response.setMessage("Review added");
	        response.setData("Review added successfully for course: " + course.getTitle());
	        response.setStatus(201);
	        return response;

	    } catch (Exception e) {
	        response.setMessage("Something went wrong");
	        response.setData("Error: " + e.getMessage());
	        response.setStatus(500);
	        return response;
	    }
	}

}
