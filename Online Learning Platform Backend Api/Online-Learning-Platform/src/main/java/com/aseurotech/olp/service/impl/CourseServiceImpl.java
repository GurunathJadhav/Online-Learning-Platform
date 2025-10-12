package com.aseurotech.olp.service.impl;

import java.util.*;
import java.util.stream.Collectors;

import com.aseurotech.olp.entity.*;
import com.aseurotech.olp.entity.Module;
import com.aseurotech.olp.payload.response.*;
import com.aseurotech.olp.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.aseurotech.olp.payload.request.CourseRequest;
import com.aseurotech.olp.payload.request.LessonRequest;
import com.aseurotech.olp.payload.request.ModuleRequest;
import com.aseurotech.olp.service.CourseService;

@Service
public class CourseServiceImpl implements CourseService {
	
	private final CourseRepository courseRepository;
	private final UserRepository userRepository;
	private final EnrollmentRepository enrollmentRepository;
	private final LessonRepository lessonRepository;
	private final ModuleRepository moduleRepository;
	private final AssignmentRepository assignmentRepository;
	private final SubmissionRepository submissionRepository;
	
	

	public CourseServiceImpl(CourseRepository courseRepository, UserRepository userRepository, EnrollmentRepository enrollmentRepository, LessonRepository lessonRepository, ModuleRepository moduleRepository, AssignmentRepository assignmentRepository, SubmissionRepository submissionRepository) {
		super();
		this.courseRepository = courseRepository;
		this.userRepository = userRepository;
		this.enrollmentRepository = enrollmentRepository;
		this.lessonRepository = lessonRepository;
		this.moduleRepository = moduleRepository;
        this.assignmentRepository = assignmentRepository;
        this.submissionRepository = submissionRepository;
    }


	@Override
	public ApiResponse<String> addCourse(CourseRequest request) {
		ApiResponse<String> response =new ApiResponse<String>();
		Course course=new Course();
		
		course.setTitle(request.getTitle());
		course.setDescription(request.getDescription());
		course.setPrice(request.getPrice());
		course.setUser(userRepository.findById(request.getUserId()).orElseThrow(()-> new RuntimeException("User not found")));
		
		List<Module> modules = request.getModules().stream().map(moduleRequest->{
			Module module=new Module();
			module.setTitle(moduleRequest.getTitle());
			module.setCourse(course);
			
			List<Lesson> lessons=moduleRequest.getLessons().stream().map(lessonRequest->{
				Lesson lesson=new Lesson();
				lesson.setTitle(lessonRequest.getTitle());
				lesson.setContent(lessonRequest.getContent());
				lesson.setModule(module);
				return lesson;
			}).collect(Collectors.toList());
			
			module.setLessons(lessons);
			return module;
		}).collect(Collectors.toList());
		
		course.setModules(modules);
		
		Course savedCourse = courseRepository.save(course);
		if(savedCourse!=null) {
			response.setMessage("Course added successfully");
			response.setData(savedCourse.getTitle()+" is successfully added");
			response.setStatus(201);
			return response;
		}
		response.setMessage("Course addition failed");
		response.setData("Error during adding course");
		response.setStatus(500);
		return response;
	}


	@Override
	public ApiResponse<List<CourseResponse>> courseList(int pageSize, int pageNumber) {
	    ApiResponse<List<CourseResponse>> response = new ApiResponse<>();
	    
	    PageRequest page = PageRequest.of(pageNumber, pageSize);
	    
	    Page<Course> coursePage = courseRepository.findAllByOrderByIdDesc(page);
	    
	    List<Course> courses = coursePage.getContent();
	    int totalPages = coursePage.getTotalPages();
	    
	    List<CourseResponse> courseList = courses.stream().map(course -> {
	        CourseResponse courseResponse = new CourseResponse();
	        courseResponse.setId(course.getId());
	        courseResponse.setTitle(course.getTitle());
	        courseResponse.setDescription(course.getDescription());
			courseResponse.setInstructor(course.getUser().getUsername());
	        return courseResponse;
	    }).collect(Collectors.toList());
	    
	    response.setMessage("Course list with page numbers " + totalPages);
	    response.setData(courseList);
	    response.setStatus(200);
	    
	    return response;
	}



	@Override
	public ApiResponse<CourseWithModuleResponse> getCourse(long courseId) {
		ApiResponse<CourseWithModuleResponse> response=new ApiResponse<CourseWithModuleResponse>();
		CourseWithModuleResponse courseWithModuleResponse=new CourseWithModuleResponse();
		
		Course course = courseRepository.findById(courseId).orElseThrow(()-> new RuntimeException("Course not found"));
		
		courseWithModuleResponse.setId(course.getId());
		courseWithModuleResponse.setTitle(course.getTitle());
		courseWithModuleResponse.setDescription(course.getDescription());
		courseWithModuleResponse.setPrice(course.getPrice());
		
		List<ModuleResponse> modules = course.getModules().stream().map(m->{
			ModuleResponse module=new ModuleResponse();
			module.setId(m.getId());
			module.setTitle(m.getTitle());
			return module;
		}).collect(Collectors.toList());
		
		courseWithModuleResponse.setModules(modules);
		
		response.setMessage("Course Data with id "+courseId);
		response.setData(courseWithModuleResponse);
		response.setStatus(200);
	
		return response;
	}


	@Override
	public ApiResponse<List<CourseResponse>> searchCourse(String search, int pageSize, int pageNumber) {
		
		ApiResponse<List<CourseResponse>> response=new ApiResponse<>();
		PageRequest page = PageRequest.of(pageNumber, pageSize);
		Page<Course> courseContent = courseRepository.search(search, page);
		List<Course> courses = courseContent.getContent();
        List<CourseResponse> courseList = courses.stream().map(course -> {
            CourseResponse courseResponse = new CourseResponse();
            courseResponse.setId(course.getId());
            courseResponse.setTitle(course.getTitle());
            courseResponse.setDescription(course.getDescription());
            return courseResponse;
        }).collect(Collectors.toList());
        
        response.setMessage("Course list");
        response.setData(courseList);
        response.setStatus(200);
		
		return response;
	}


	@Override
	public ApiResponse<String> editCourse(CourseRequest request, long courseId) {
		 ApiResponse<String> response=new ApiResponse<>();

	        Course course = courseRepository.findById(courseId).orElseThrow(() -> new RuntimeException("Course data not found"));

	        course.setTitle(request.getTitle());
	        course.setDescription(request.getDescription());
	        course.setPrice(request.getPrice());
	        List<Module> existingModules = course.getModules();
	        List<Module> updatedModules=new ArrayList<>();

	        for(ModuleRequest moduleDto:request.getModules()){
	            Module module = existingModules.stream()
	                    .filter(existingModule -> existingModule.getId() == moduleDto.getId())
	                    .findFirst()
	                    .orElse(new Module());
	            module.setTitle(moduleDto.getTitle());

	            List<Lesson> existingLessons = module.getLessons();
	            List<Lesson> updatedLessons=new ArrayList<>();
	            for(LessonRequest lessonDto:moduleDto.getLessons()){
	                Lesson lesson = existingLessons.stream()
	                        .filter(existingLesson -> existingLesson.getId() == lessonDto.getId())
	                        .findFirst()
	                        .orElse(new Lesson());
	                lesson.setTitle(lessonDto.getTitle());
	                lesson.setContent(lessonDto.getContent());
	                lesson.setModule(module);
	                updatedLessons.add(lesson);
	            }
	            existingLessons.removeIf(existingLesson-> updatedLessons.stream()
	                    .noneMatch(updatedLesson->updatedLesson.getId()==existingLesson.getId()));
	           existingLessons.addAll(updatedLessons);
	           module.setLessons(existingLessons);
	           updatedModules.add(module);
	        }
	        existingModules.removeIf(existingModule-> updatedModules.stream()
	                .noneMatch(updatedModule->updatedModule.getId()==existingModule.getId()));
	        existingModules.addAll(updatedModules);
	        course.setModules(existingModules);
	        Course updatedCourse = courseRepository.saveAndFlush(course);
	        if(updatedCourse!=null){
	            response.setMessage("Course updated successfully ");
	            response.setData(updatedCourse.getTitle()+" updated successfully");
	            response.setStatus(200);
	            return response;
	        }
	        response.setMessage("Course updated failed ");
	        response.setData("Error during course updating process");
	        response.setStatus(500);
	        return response;
	}


	@Override
	public ApiResponse<String> deleteCourse(long courseId) {
		ApiResponse<String> response=new ApiResponse<String>();
		Course course = courseRepository.findById(courseId).orElseThrow(()-> new RuntimeException("Course not found"));
		try {
			courseRepository.delete(course);
			response.setMessage("Course Deleted successfully");
			response.setData("Course has been deleted with id "+courseId);
			response.setStatus(200);
			return response;
		}catch (Exception e) {
			response.setMessage("Course Deletion Failed");
			response.setData("Error during course deletion process");
			response.setStatus(500);
			return response;
		}
		
	}


	@Override
	public ApiResponse<EnrolledCourseResponse> enrolledCourse(long courseId,long userId) {
		ApiResponse<EnrolledCourseResponse> response=new ApiResponse<EnrolledCourseResponse>();
		
		 Enrollment enrollment = enrollmentRepository.findByUserIdAndCourseId(userId, courseId)
				 .orElseThrow(()-> new RuntimeException("Enrollment data not found"));
		
		 Course course = enrollment.getCourse();
		EnrolledCourseResponse enrolledCourseResponse =new EnrolledCourseResponse();
		enrolledCourseResponse.setId(course.getId());
		enrolledCourseResponse.setTitle(course.getTitle());
		enrolledCourseResponse.setDescription(course.getDescription());
		
		List<EnrolledModule> modules = course.getModules().stream().map(module->{
			EnrolledModule enrolledModule=new EnrolledModule();
			enrolledModule.setId(module.getId());
			enrolledModule.setTitle(module.getTitle());
			
			List<EnrolledLesson> lessons = module.getLessons().stream().map(lesson->{
				EnrolledLesson enrolledLesson=new EnrolledLesson();
				enrolledLesson.setId(lesson.getId());
				enrolledLesson.setTitle(lesson.getTitle());
				enrolledLesson.setContent(lesson.getContent());
				
				return enrolledLesson;
			}).collect(Collectors.toList());
			
			enrolledModule.setLessons(lessons);
			
			return enrolledModule;
		}).collect(Collectors.toList());
		
		enrolledCourseResponse.setModules(modules);
		
		response.setMessage(course.getTitle()+" details");
		response.setData(enrolledCourseResponse);
		response.setStatus(200);
		
		return response;
	}


	@Override
	public ApiResponse<List<CourseResponse>> enrolledCourses(int pageSize, int pageNumber, long userId) {
	    ApiResponse<List<CourseResponse>> response = new ApiResponse<>();

	    PageRequest pageable = PageRequest.of(pageNumber, pageSize);

	    Page<Course> enrolledCoursesPage = courseRepository.findByEnrollmentsUserId(userId, pageable);

	    List<Course> courses = enrolledCoursesPage.getContent();
	    List<CourseResponse> enrolledCourseList = courses.stream().map(course->{
	    	CourseResponse courseResponse=new CourseResponse();
	    	courseResponse.setId(course.getId());
	    	courseResponse.setTitle(course.getTitle());
	    	courseResponse.setDescription(course.getDescription());
	    	
	    	return courseResponse;
	    }).collect(Collectors.toList());

	    response.setData(enrolledCourseList);
	    response.setMessage("Fetched enrolled courses successfully.");
	    response.setStatus(200);
	

	    return response;
	}


	@Override
	public ApiResponse<List<LessonResponse>> getLessons(long courseId, long moduleId) {
	    ApiResponse<List<LessonResponse>> response = new ApiResponse<>();

	    try {
	       
	       Course course = courseRepository.findById(courseId).orElseThrow(()-> new RuntimeException("Course data not found"));
	        
	        Module module = moduleRepository.findByIdAndCourseId(moduleId, course.getId()).orElseThrow(()-> new RuntimeException("Module data not found"));
	        

	       List<Lesson> lessons = lessonRepository.findAllByModuleId(module.getId());
	       List<LessonResponse> lessonList = lessons.stream().map(lesson->{
	    	   LessonResponse lessonResponse=new LessonResponse();
	    	   lessonResponse.setId(lesson.getId());
	    	   lessonResponse.setTitle(lesson.getTitle());
	    	   lessonResponse.setContent(lesson.getContent());
	    	   return lessonResponse;
	       }).collect(Collectors.toList());

	       
	        response.setStatus(200);
	        response.setMessage("Lessons fetched successfully");
	        response.setData(lessonList);
	        return response;

	    } catch (Exception e) {
	        throw new RuntimeException("Failed to load lesson data");
	    }
	}


	@Override
	public ApiResponse<EnrolledCourseResponse> getCourseDetails(long courseId) {
		ApiResponse<EnrolledCourseResponse> response=new ApiResponse<EnrolledCourseResponse>();
		EnrolledCourseResponse coursedetails=new EnrolledCourseResponse();
		
		Course course = courseRepository.findById(courseId).orElseThrow(()-> new RuntimeException("Course not found"));
		
		coursedetails.setId(course.getId());
		coursedetails.setTitle(course.getTitle());
		coursedetails.setDescription(course.getDescription());
		coursedetails.setPrice(course.getPrice());
		
		List<EnrolledModule> modules = course.getModules().stream().map(m->{
			EnrolledModule module=new EnrolledModule();
			module.setId(m.getId());
			module.setTitle(m.getTitle());
			
			List<EnrolledLesson> lessons = m.getLessons().stream().map(l->{
				EnrolledLesson lesson=new EnrolledLesson();
				lesson.setId(l.getId());
				lesson.setTitle(l.getTitle());
				lesson.setContent(l.getContent());
				return lesson;
			}).collect(Collectors.toList());
			
			module.setLessons(lessons);
			return module;
		}).collect(Collectors.toList());
		
		coursedetails.setModules(modules);
		
		response.setMessage("Course Data with id "+courseId);
		response.setData(coursedetails);
		response.setStatus(200);
	
		return response;
	}

	@Override
	public ApiResponse<DashboardResponse> getDashboardData(int pageSize, int pageNumber, long userId) {
		ApiResponse<DashboardResponse> response = new ApiResponse<>();
		DashboardResponse data = new DashboardResponse();

		try {
			Pageable page = PageRequest.of(pageNumber, pageSize);

			Page<Course> coursePage = courseRepository.findByEnrollmentsUserId(userId, page);
			List<Course> enrolledCourses = coursePage.getContent();
			data.setTotalCoursesEnrolled(enrolledCourses.size());

			List<String> enrolledCourseTitles = enrolledCourses.stream()
					.map(Course::getTitle)
					.toList();
			data.setEnrolledCourses(enrolledCourseTitles);

			List<Assignment> allAssignments = assignmentRepository.findAssignmentsByCourseIds(
					enrolledCourses.stream().map(Course::getId).toList()
			);

			List<Submission> userSubmissions = submissionRepository.findByUserId(userId);

			int completedAssignments = 0;
			int pendingAssignments = 0;
			List<Integer> courseCompletionRates = new ArrayList<>();
			List<Integer> courseGrades = new ArrayList<>();

			Map<Long, List<Assignment>> courseAssignmentsMap = allAssignments.stream()
					.collect(Collectors.groupingBy(a -> a.getCourse().getId()));

			for (Course course : enrolledCourses) {
				List<Assignment> courseAssignments = courseAssignmentsMap.getOrDefault(course.getId(), Collections.emptyList());

				int totalAssignments = courseAssignments.size();
				int completedForCourse = 0;
				int totalGradeForCourse = 0;

				for (Assignment assignment : courseAssignments) {
					Submission submission = userSubmissions.stream()
							.filter(s -> s.getAssignment().getId() == assignment.getId())
							.findFirst()
							.orElse(null);

					int grade = submission != null && submission.getGrade() != null ? submission.getGrade() : 0;
					totalGradeForCourse += grade;

					if (submission != null) {
						completedForCourse++;
					}
				}

				int avgGrade = totalAssignments > 0 ? totalGradeForCourse / totalAssignments : 0;
				courseGrades.add(avgGrade);

				int completionPercent = totalAssignments > 0 ? (completedForCourse * 100 / totalAssignments) : 0;
				courseCompletionRates.add(completionPercent);

				completedAssignments += completedForCourse;
				pendingAssignments += totalAssignments - completedForCourse;
			}

			data.setCompletedAssignments(completedAssignments);
			data.setPendingAssignments(pendingAssignments);
			data.setGrades(courseGrades);
			data.setCompletionRate(courseCompletionRates);

			List<String> topCourses = courseRepository.findAll(Sort.by(Sort.Direction.DESC, "id"))
					.stream()
					.limit(5)
					.map(Course::getTitle)
					.toList();
			data.setTopCourses(topCourses);

			int averageProgress = courseCompletionRates.isEmpty() ? 0 :
					(int) courseCompletionRates.stream().mapToInt(Integer::intValue).average().orElse(0);
			data.setCourseProgress(averageProgress);

			response.setStatus(200);
			response.setMessage("Dashboard data fetched successfully");
			response.setData(data);

		} catch (Exception e) {
			response.setStatus(500);
			response.setMessage("Failed to fetch dashboard data: " + e.getMessage());
			response.setData(null);
		}

		return response;
	}

	@Override
	public ApiResponse<InstructorDashboardResponse> getInstructorDashboardData(long userId) {
		ApiResponse<InstructorDashboardResponse> response = new ApiResponse<>();
		InstructorDashboardResponse dashboard = new InstructorDashboardResponse();

		try {
			// 1️⃣ Get all courses created by this instructor
			List<Course> instructorCourses = courseRepository.findByUserId(userId);

			if (instructorCourses.isEmpty()) {
				response.setStatus(200);
				response.setMessage("No courses found for this instructor");
				response.setData(dashboard);
				return response;
			}

			// Data containers
			int totalEnrolled = 0;
			int totalAssignmentsCompleted = 0;
			int totalAssignmentsPending = 0;

			List<String> enrolledCourses = new ArrayList<>();
			List<Integer> totalEnrolledUsersEachCourse = new ArrayList<>();
			List<Integer> totalGradesEachCourse = new ArrayList<>();
			List<Integer> eachCourseCompletionRate = new ArrayList<>();

			// Map course -> enrolled count (to get top 5)
			Map<Course, Integer> enrollmentMap = new HashMap<>();

			// 2️⃣ Process each course
			for (Course course : instructorCourses) {
				int enrolledCount = enrollmentRepository.countByCourseId(course.getId());
				enrollmentMap.put(course, enrolledCount);

				if (enrolledCount > 0) {
					enrolledCourses.add(course.getTitle());
					totalEnrolled += enrolledCount;

					// 3️⃣ Assignments and submissions
					List<Assignment> assignments = assignmentRepository.findAllByCourse(course);
					int completedCount = 0;
					int gradeSum = 0;

					for (Assignment assignment : assignments) {
						List<Submission> submissions = submissionRepository.findAllByAssignmentId(assignment.getId());

						for (Submission submission : submissions) {
							if (submission.getGrade() != null) {
								completedCount++;
								gradeSum += submission.getGrade();
							}
						}
					}

					int pendingCount = (assignments.size() * enrolledCount) - completedCount;
					totalAssignmentsCompleted += completedCount;
					totalAssignmentsPending += Math.max(pendingCount, 0);

					int avgGrade = (completedCount > 0) ? (gradeSum / completedCount) : 0;
					totalGradesEachCourse.add(avgGrade);

					int completionRate = (assignments.size() > 0 && enrolledCount > 0)
							? (completedCount * 100) / (assignments.size() * enrolledCount)
							: 0;
					eachCourseCompletionRate.add(completionRate);

					totalEnrolledUsersEachCourse.add(enrolledCount);
				}
			}

			// 4️⃣ Determine top 5 courses by enrollment count
			List<String> topCourses = enrollmentMap.entrySet().stream()
					.sorted(Map.Entry.<Course, Integer>comparingByValue().reversed())
					.limit(5)
					.map(entry -> entry.getKey().getTitle())
					.collect(Collectors.toList());

			// 5️⃣ Fill dashboard data
			dashboard.setTotalCourses(instructorCourses.size());
			dashboard.setTotalEnrolled(totalEnrolled);
			dashboard.setTotalAssignmentCompleted(totalAssignmentsCompleted);
			dashboard.setTotalAssignmentPending(totalAssignmentsPending);
			dashboard.setTopCourses(topCourses);
			dashboard.setEnrolledCourses(enrolledCourses);
			dashboard.setTotalEnrolledUsersEachCourse(totalEnrolledUsersEachCourse);
			dashboard.setTotalGradesEachCourse(totalGradesEachCourse);
			dashboard.setEachCourseCompletionRate(eachCourseCompletionRate);

			// ✅ Success response
			response.setStatus(200);
			response.setMessage("Instructor dashboard data fetched successfully");
			response.setData(dashboard);

		} catch (Exception e) {
			response.setStatus(500);
			response.setMessage("Error fetching instructor dashboard data: " + e.getMessage());
			response.setData(null);
			e.printStackTrace();
		}

		return response;
	}

	@Override
	public ApiResponse<AdminDashboardResponse> getAdminDashboardData() {
		ApiResponse<AdminDashboardResponse> response = new ApiResponse<>();
		AdminDashboardResponse dashboard = new AdminDashboardResponse();

		try {
			// ===== Basic Stats =====
			int totalUsers = (int) userRepository.count();
			int totalInstructors = userRepository.countByUserRolesRoleName("INSTRUCTOR");
			int totalStudents = userRepository.countByUserRolesRoleName("STUDENT");
			int totalCourses = (int) courseRepository.count();
			int totalEnrollments = (int) enrollmentRepository.count();

			dashboard.setNumberOfUsers(totalUsers);
			dashboard.setNumberOfInstructor(totalInstructors);
			dashboard.setNumberOfStudents(totalStudents);
			dashboard.setNumberOfCourses(totalCourses);
			dashboard.setNumberOfCourseEnrollment(totalEnrollments);

			// ===== Revenue per Course =====
			List<Course> allCourses = courseRepository.findAll();
			Map<String, Integer> courseRevenueMap = new HashMap<>();

			for (Course course : allCourses) {
				List<Enrollment> enrollments = enrollmentRepository.findByCourse(course);
				int totalRevenue = enrollments.size() * course.getPrice().intValue();
				courseRevenueMap.put(course.getTitle(), totalRevenue);
			}

			// ===== Top 5 Courses by Revenue =====
			List<Map.Entry<String, Integer>> sortedCourses = courseRevenueMap.entrySet()
					.stream()
					.sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
					.limit(5)
					.collect(Collectors.toList());

			List<String> topCourses = sortedCourses.stream()
					.map(Map.Entry::getKey)
					.collect(Collectors.toList());

			List<Integer> revenuePerCourse = sortedCourses.stream()
					.map(Map.Entry::getValue)
					.collect(Collectors.toList());

			dashboard.setTopCourses(topCourses);
			dashboard.setRevenuePerCourse(revenuePerCourse);

			// ===== Recently Registered Users =====
			List<User> recentUsers = userRepository.findTop5ByOrderByCreatedAtDesc();
			List<String> registeredUsers = recentUsers.stream()
					.map(User::getUsername)
					.collect(Collectors.toList());

			dashboard.setCurrentRegisteredUsers(registeredUsers);

			// ===== Success Response =====
			response.setStatus(200);
			response.setMessage("Admin Dashboard data fetched successfully");
			response.setData(dashboard);

		} catch (Exception e) {
			e.printStackTrace();
			response.setStatus(500);
			response.setMessage("Error fetching admin dashboard data: " + e.getMessage());
			response.setData(null);
		}

		return response;
	}



}
