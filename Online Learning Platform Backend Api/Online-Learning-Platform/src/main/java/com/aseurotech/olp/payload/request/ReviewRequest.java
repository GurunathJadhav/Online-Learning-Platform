package com.aseurotech.olp.payload.request;


public class ReviewRequest {
	
	private long id;
	
	private Integer reating;
	
	private String comment;
	
	private long courseId;
	
	private long userId;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public Integer getReating() {
		return reating;
	}

	public void setReating(Integer reating) {
		this.reating = reating;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public long getCourseId() {
		return courseId;
	}

	public void setCourseId(long courseId) {
		this.courseId = courseId;
	}

	public long getUserId() {
		return userId;
	}

	public void setUserId(long userId) {
		this.userId = userId;
	}
	
	

}
