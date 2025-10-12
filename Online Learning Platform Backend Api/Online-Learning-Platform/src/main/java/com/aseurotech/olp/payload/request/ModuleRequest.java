package com.aseurotech.olp.payload.request;

import java.util.ArrayList;
import java.util.List;

public class ModuleRequest {
	
	private long id;
	
	private String title;
	
	private List<LessonRequest> lessons=new ArrayList<LessonRequest>();

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

	public List<LessonRequest> getLessons() {
		return lessons;
	}

	public void setLessons(List<LessonRequest> lessons) {
		this.lessons = lessons;
	}
	
	

}
