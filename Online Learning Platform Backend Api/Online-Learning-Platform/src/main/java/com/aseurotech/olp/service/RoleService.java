package com.aseurotech.olp.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.aseurotech.olp.entity.Role;
import com.aseurotech.olp.repository.RoleRepository;

import jakarta.annotation.PostConstruct;

@Service
public class RoleService {
	
	private final RoleRepository repository;

	public RoleService(RoleRepository repository) {
		super();
		this.repository = repository;
	}
	
	@PostConstruct
	private void setRoles() {
		
		List<Role> roles=new ArrayList<Role>();
		
		if(!repository.existsByName("ADMIN")) {
			Role adminRole=new Role();
			adminRole.setName("ADMIN");
			roles.add(adminRole);
		}
		if(!repository.existsByName("INSTRUCTOR")) {
			Role instructorRole=new Role();
			instructorRole.setName("INSTRUCTOR");
			roles.add(instructorRole);
		}
		if(!repository.existsByName("STUDENT")) {
			Role studentRole=new Role();
			studentRole.setName("STUDENT");
			roles.add(studentRole);
		}
		
		repository.saveAll(roles);
		
	}
	
	

}
