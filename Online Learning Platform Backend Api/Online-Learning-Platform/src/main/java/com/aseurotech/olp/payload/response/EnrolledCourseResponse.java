package com.aseurotech.olp.payload.response;

import java.util.ArrayList;
import java.util.List;

public class EnrolledCourseResponse {
	
	private long id;
	
	private String title;
	
	private String description;
	private double price;
	
	private List<EnrolledModule> modules=new ArrayList<EnrolledModule>();

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

	public List<EnrolledModule> getModules() {
		return modules;
	}

	public void setModules(List<EnrolledModule> modules) {
		this.modules = modules;
	}

	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}
	
	
	

}
