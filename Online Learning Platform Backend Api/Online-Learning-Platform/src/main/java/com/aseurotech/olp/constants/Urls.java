package com.aseurotech.olp.constants;

public class Urls {
	
	public static final String[] openUrls= {
			"/api/olp/auth/signup",
			"/api/olp/auth/signin"
	};
	
	
	public static final String[] instructorUrls= {
			"/api/olp/course/add-course",
			"/api/olp/course/edit-course",
			"/api/olp/course/delete-course",
			"/api/olp/assignment/add-assignment",
			"/api/olp/assignment/assignment-list",
			"/api/olp/assignment/get-assignment",
			"/api/olp/submission/submission-list"
	};
	
	public static final String[] openForAllUsers= {
			"/api/olp/course/search-course",
			"/api/olp/course/get-course",
			"/api/olp/course/course-list"
	};
	
	public static final String[] studentUrls= {
			"/api/olp/assignment/assignment-list",
			"/api/olp/assignment/get-assignment",
			"/api/olp/submission/submit-assessment",
			"/api/olp/enrollment/enroll",
			"/api/olp/enrollment/success",
			"/api/olp/enrollment/cancel",
			"/api/olp/course/enrolled-course"
			
	};

}
