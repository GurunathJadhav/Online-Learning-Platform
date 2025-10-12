package com.aseurotech.olp.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.management.JMRuntimeException;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.aseurotech.olp.entity.Assignment;
import com.aseurotech.olp.entity.Course;
import com.aseurotech.olp.payload.request.AssignmentRequest;
import com.aseurotech.olp.payload.response.ApiResponse;
import com.aseurotech.olp.payload.response.AssignmentResponse;
import com.aseurotech.olp.repository.AssignmentRepository;
import com.aseurotech.olp.repository.CourseRepository;
import com.aseurotech.olp.service.AssignmentService;

@Service
public class AssignmentServiceImpl implements AssignmentService {
	
	private final AssignmentRepository assignmentRepository;
	private final CourseRepository courseRepository;
	
	

	public AssignmentServiceImpl(AssignmentRepository assignmentRepository, CourseRepository courseRepository) {
		super();
		this.assignmentRepository = assignmentRepository;
		this.courseRepository = courseRepository;
		
	}



	@Override
	public ApiResponse<String> addAssignment(AssignmentRequest request) {
		ApiResponse<String> response=new ApiResponse<String>();
		Assignment assignment=new Assignment();
		assignment.setTitle(request.getTitle());
		assignment.setDescription(request.getDescription());
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        LocalDate localDate = LocalDate.parse(request.getDueDate(), formatter);
        LocalDateTime dueDateTime = localDate.atStartOfDay();
		assignment.setDueDate(dueDateTime);
		assignment.setCourse(courseRepository.findById(request.getCourseId()).orElseThrow(()-> new RuntimeException("Course data not found")));
		Assignment savedAssignment = assignmentRepository.save(assignment);
		if(savedAssignment!=null) {
			response.setMessage("Assignment is added for course");
			response.setData("Assignment has been published for course with id "+request.getCourseId());
			response.setStatus(201);
			return response;
		}
		response.setMessage("Assignment addition failed");
		response.setData("Error during assignement addition process");
		response.setStatus(500);
		return response;
	}



	@Override
	public ApiResponse<List<AssignmentResponse>> assignmentList(int pageNumber, int pageSize, long courseId) {
	    ApiResponse<List<AssignmentResponse>> response = new ApiResponse<>();

	    try {
	        Optional<Course> courseOptional = courseRepository.findById(courseId);
	        if (!courseOptional.isPresent()) {
	            response.setMessage("Course not found for ID: " + courseId);
	            response.setData(null);
	            response.setStatus(404);
	            return response;
	        }

	        Course course = courseOptional.get();
	        PageRequest pageRequest = PageRequest.of(pageNumber, pageSize);

	        Page<Assignment> assignmentPage = assignmentRepository.findAllByCourseOrderByDueDateDesc(course, pageRequest);

	        List<AssignmentResponse> assignmentList = assignmentPage.getContent().stream().map(assignment -> {
	            AssignmentResponse assignmentResponse = new AssignmentResponse();
	            assignmentResponse.setId(assignment.getId());
	            assignmentResponse.setTitle(assignment.getTitle());
	            assignmentResponse.setDescription(assignment.getDescription());
	            assignmentResponse.setDueDate(assignment.getDueDate());
	            return assignmentResponse;
	        }).collect(Collectors.toList());

	        if (assignmentList.isEmpty()) {
	            response.setMessage("No assignments available for course: " + course.getTitle());
	            response.setData(null);
	        } else {
	            response.setMessage("Recent assignments list for course: " + course.getTitle() +
	                    " (Total pages: " + assignmentPage.getTotalPages() + ")");
	            response.setData(assignmentList);
	        }

	        response.setStatus(200);
	        return response;

	    } catch (Exception e) {
	        response.setMessage("Error fetching assignments: " + e.getMessage());
	        response.setData(null);
	        response.setStatus(500);
	        return response;
	    }
	}





	@Override
	public ApiResponse<AssignmentResponse> getAssignment(long assignmentId, long courseId) {
		ApiResponse<AssignmentResponse> response=new ApiResponse<AssignmentResponse>();
		Assignment assignment = assignmentRepository.findByIdAndCourseId(assignmentId,courseId).orElseThrow(()-> new JMRuntimeException("Assignment not found for course"));
		AssignmentResponse assignmentResponse=new AssignmentResponse();
		assignmentResponse.setId(assignment.getId());
		assignmentResponse.setTitle(assignment.getTitle());
		assignmentResponse.setDescription(assignment.getDescription());
		assignmentResponse.setDueDate(assignment.getDueDate());
		response.setMessage("Assignment for course");
		response.setData(assignmentResponse);
		response.setStatus(200);
		return response;
	}

}
