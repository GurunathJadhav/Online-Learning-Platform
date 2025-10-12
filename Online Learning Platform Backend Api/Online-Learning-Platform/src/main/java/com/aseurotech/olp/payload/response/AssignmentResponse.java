package com.aseurotech.olp.payload.response;

import java.time.LocalDateTime;

public class AssignmentResponse {
	
	private long id;
	
	private String title;
	
	private String description;
	
	private LocalDateTime dueDate;

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

	public LocalDateTime getDueDate() {
		return dueDate;
	}

	public void setDueDate(LocalDateTime dueDate) {
		this.dueDate = dueDate;
	}

	
	
	
	

}
