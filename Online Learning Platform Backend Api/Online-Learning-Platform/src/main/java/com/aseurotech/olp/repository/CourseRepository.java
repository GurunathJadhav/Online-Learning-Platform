package com.aseurotech.olp.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.aseurotech.olp.entity.Course;
import com.aseurotech.olp.entity.User;

public interface CourseRepository extends JpaRepository<Course, Long> {
	
	 @Query("""
			    SELECT DISTINCT c 
			    FROM Course c 
			    LEFT JOIN c.modules m 
			    WHERE LOWER(c.title) LIKE LOWER(CONCAT('%', :search, '%')) 
			       OR LOWER(m.title) LIKE LOWER(CONCAT('%', :search, '%'))
			""")
			    Page<Course> search(@Param("search") String search, Pageable pageable);

	 Optional<Course> findByIdAndUser(long courseId, User user);

	 Page<Course> findByEnrollmentsUserId(long userId, Pageable pageable);

	 Page<Course> findAllByOrderByIdDesc(Pageable pageable);


	List<Course> findByUserId(long userId);
}
