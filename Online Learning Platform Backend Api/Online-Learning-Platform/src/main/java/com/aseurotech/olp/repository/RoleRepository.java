package com.aseurotech.olp.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aseurotech.olp.entity.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {
	
	boolean existsByName(String name);

}
