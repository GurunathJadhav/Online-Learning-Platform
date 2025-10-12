package com.aseurotech.olp.payload.response;

import java.util.ArrayList;
import java.util.List;

public class CourseWithModuleResponse {
	
	 private Long id;

	    private String title;

	    private String description;

	    private Double price;

	    private List<ModuleResponse> modules = new ArrayList<>();

		public Long getId() {
			return id;
		}

		public void setId(Long id) {
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

		public List<ModuleResponse> getModules() {
			return modules;
		}

		public void setModules(List<ModuleResponse> modules) {
			this.modules = modules;
		}
	    
	    


}
