package com.aseurotech.olp.payload.response;

public class CourseResponse {
	
	private long id;
	
	private String title;
	
	private String description;
	private String instructor;
	
	
	
	
	public CourseResponse() {
		super();
	}

	public CourseResponse(long id, String title, String description) {
		super();
		this.id = id;
		this.title = title;
		this.description = description;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getInstructor() {
		return instructor;
	}

	public void setInstructor(String instructor) {
		this.instructor = instructor;
	}
}
