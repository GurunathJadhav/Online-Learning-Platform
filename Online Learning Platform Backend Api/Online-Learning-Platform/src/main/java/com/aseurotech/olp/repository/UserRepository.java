package com.aseurotech.olp.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aseurotech.olp.entity.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User, Long> {
	
	Optional<User> findByUsername(String username);
	
	boolean existsByUsername(String username);
	boolean existsByEmail(String email);

	@Query("SELECT COUNT(u) FROM User u JOIN u.userRoles ur WHERE ur.role.name = :roleName")
	int countByUserRolesRoleName(@Param("roleName") String roleName);

	List<User> findTop5ByOrderByCreatedAtDesc();

	@Query("SELECT DISTINCT u FROM User u JOIN u.userRoles ur JOIN ur.role r WHERE r.name = :roleName")
	List<User> findUsersByRoleName(@Param("roleName") String roleName);


}
