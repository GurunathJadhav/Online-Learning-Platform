package com.aseurotech.olp.payload.response;

import java.util.ArrayList;
import java.util.List;

public class EnrolledModule {
	
	private long id;
	
	private String title;
	
	private List<EnrolledLesson> lessons=new ArrayList<EnrolledLesson>();

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

	public List<EnrolledLesson> getLessons() {
		return lessons;
	}

	public void setLessons(List<EnrolledLesson> lessons) {
		this.lessons = lessons;
	}
	
	

}
