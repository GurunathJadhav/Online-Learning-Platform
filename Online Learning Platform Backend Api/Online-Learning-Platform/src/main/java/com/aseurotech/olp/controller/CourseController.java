package com.aseurotech.olp.controller;

import java.util.List;

import com.aseurotech.olp.payload.response.*;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aseurotech.olp.constants.AppConstants;
import com.aseurotech.olp.payload.request.CourseRequest;
import com.aseurotech.olp.service.CourseService;

@RestController
@RequestMapping("/api/olp/course")
@CrossOrigin(origins = "http://localhost:3000")
public class CourseController {
	
	private final CourseService courseService;

	public CourseController(CourseService courseService) {
		super();
		this.courseService = courseService;
	}
	
	
	@PostMapping("/add-course")
	public ResponseEntity<ApiResponse<String>> addCourse(@RequestBody CourseRequest courseRequest){
		ApiResponse<String> response = courseService.addCourse(courseRequest);
		return new ResponseEntity<>(response,HttpStatusCode.valueOf(response.getStatus()));
	}
	
	@GetMapping("/course-list")
	public ResponseEntity<ApiResponse<List<CourseResponse>>> courseList(
			@RequestParam(defaultValue = AppConstants.PAGE_NUMBER) int pageNumber,
			@RequestParam(defaultValue = AppConstants.PAGE_SIZE) int pageSize
			){
		ApiResponse<List<CourseResponse>> response = courseService.courseList(pageSize, pageNumber);
		
		return new ResponseEntity<>(response,HttpStatusCode.valueOf(response.getStatus()));
		
	}
	
	@GetMapping("/get-course")
	public ResponseEntity<ApiResponse<CourseWithModuleResponse>> getCourse(@RequestParam long courseId){
		ApiResponse<CourseWithModuleResponse> response = courseService.getCourse(courseId);
		return new ResponseEntity<>(response,HttpStatusCode.valueOf(response.getStatus()));
	}
	
	@GetMapping("/search-course")
	public  ResponseEntity<ApiResponse<List<CourseResponse>>> searchCourse(
			@RequestParam(defaultValue = AppConstants.PAGE_NUMBER) int pageNumber,
			@RequestParam(defaultValue = AppConstants.PAGE_SIZE) int pageSize
			,@RequestParam String search){
		
		ApiResponse<List<CourseResponse>> response = courseService.searchCourse(search, pageSize, pageNumber);
		
		return new ResponseEntity<>(response,HttpStatusCode.valueOf(response.getStatus()));
	}
	
	@PutMapping("/edit-course")
	public ResponseEntity<ApiResponse<String>> editCourse(@RequestBody CourseRequest request,@RequestParam long courseId){
		ApiResponse<String> response = courseService.editCourse(request, courseId);
		return new ResponseEntity<>(response,HttpStatusCode.valueOf(response.getStatus()));
	}
	
	@DeleteMapping("/delete-course")
	public ResponseEntity<ApiResponse<String>> deleteCourse(@RequestParam long courseId){
		ApiResponse<String> response = courseService.deleteCourse(courseId);
		return new ResponseEntity<>(response,HttpStatusCode.valueOf(response.getStatus()));
	}
	
	@GetMapping("/enrolled-course")
	public ResponseEntity<ApiResponse<EnrolledCourseResponse>> enrolledCourse(@RequestParam long courseId,@RequestParam long userId){
		ApiResponse<EnrolledCourseResponse> response = courseService.enrolledCourse(courseId,userId);
		return new ResponseEntity<>(response,HttpStatusCode.valueOf(response.getStatus()));
	}
	
	@GetMapping("/enrolled-course-list")
	public ResponseEntity<ApiResponse<List<CourseResponse>>> enrolledCourseList(
			@RequestParam(defaultValue = AppConstants.PAGE_NUMBER) int pageNumber,
			@RequestParam(defaultValue = AppConstants.PAGE_SIZE) int pageSize,@RequestParam long userId){
		ApiResponse<List<CourseResponse>> response = courseService.enrolledCourses(pageSize, pageNumber, userId);
		return new ResponseEntity<>(response,HttpStatusCode.valueOf(response.getStatus()));
	}
	
	@GetMapping("/lessons-list")
	public ResponseEntity<ApiResponse<List<LessonResponse>>> lessonsList(@RequestParam long courseId,@RequestParam long moduleId){
		ApiResponse<List<LessonResponse>> response = courseService.getLessons(courseId, moduleId);
		return new ResponseEntity<>(response,HttpStatusCode.valueOf(response.getStatus()));
	}
	
	@GetMapping("/get-course-details")
	public ResponseEntity<ApiResponse<EnrolledCourseResponse>> getCourseDetails(@RequestParam long courseId){
		ApiResponse<EnrolledCourseResponse> response = courseService.getCourseDetails(courseId);
		return new ResponseEntity<>(response,HttpStatusCode.valueOf(response.getStatus()));
	}

	@GetMapping("/dashboard-data")
	public ResponseEntity<ApiResponse<DashboardResponse>> getDashboardData(
			@RequestParam(defaultValue = AppConstants.PAGE_NUMBER) int pageNumber,
			@RequestParam(defaultValue = AppConstants.PAGE_SIZE) int pageSize,
			@RequestParam long userId
	){
		ApiResponse<DashboardResponse> response = courseService.getDashboardData(pageSize, pageNumber, userId);
		return new ResponseEntity<>(response,HttpStatusCode.valueOf(response.getStatus()));
	}

	@GetMapping("/instructor-dashboard-data")
	public ResponseEntity<ApiResponse<InstructorDashboardResponse>> getInstructorDashboardData(@RequestParam long userId){
		ApiResponse<InstructorDashboardResponse> response = courseService.getInstructorDashboardData(userId);
		return new ResponseEntity<>(response,HttpStatusCode.valueOf(response.getStatus()));

	}

	@GetMapping("/admin-dashboard-data")
	public ResponseEntity<ApiResponse<AdminDashboardResponse>> getAdminDashboardData(){
		ApiResponse<AdminDashboardResponse> response = courseService.getAdminDashboardData();
		return new ResponseEntity<>(response,HttpStatusCode.valueOf(response.getStatus()));
	}
	

}
