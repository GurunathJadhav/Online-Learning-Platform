package com.aseurotech.olp.payload.request;

import java.util.ArrayList;
import java.util.List;

public class CourseRequest {
	
	private long id;
	
	private String title;
	
	private String description;
	
	private Double price;
	
	private long userId;
	
	private List<ModuleRequest> modules=new ArrayList<ModuleRequest>();

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

	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}

	public long getUserId() {
		return userId;
	}

	public void setUserId(long userId) {
		this.userId = userId;
	}

	public List<ModuleRequest> getModules() {
		return modules;
	}

	public void setModules(List<ModuleRequest> modules) {
		this.modules = modules;
	}
	
	

}
