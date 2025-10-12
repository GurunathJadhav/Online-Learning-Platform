package com.aseurotech.olp.service;

import java.util.List;

import com.aseurotech.olp.payload.request.CourseRequest;
import com.aseurotech.olp.payload.response.*;

public interface CourseService {
	
	ApiResponse<String> addCourse(CourseRequest request);
	ApiResponse<List<CourseResponse>> courseList(int pageSize,int pageNumber);
	ApiResponse<CourseWithModuleResponse> getCourse(long courseId);
	ApiResponse<List<CourseResponse>> searchCourse(String search,int pageSize,int pageNumber);
	ApiResponse<String> editCourse(CourseRequest request,long courseId);
	ApiResponse<String> deleteCourse(long courseId);
	
	ApiResponse<EnrolledCourseResponse> enrolledCourse(long courseId,long userId);
	ApiResponse<List<CourseResponse>> enrolledCourses(int pageSize,int pageNumber,long userId);
	ApiResponse<List<LessonResponse>> getLessons(long courseId,long moduleId);
	ApiResponse<EnrolledCourseResponse> getCourseDetails(long courseId);
	ApiResponse<DashboardResponse> getDashboardData(int pageSize,int pageNumber,long userId);
	ApiResponse<InstructorDashboardResponse> getInstructorDashboardData(long userId);
	ApiResponse<AdminDashboardResponse> getAdminDashboardData();


}
