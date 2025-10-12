package com.aseurotech.olp.repository;


import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.aseurotech.olp.entity.Assignment;
import com.aseurotech.olp.entity.Course;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {

	List<Assignment> findAllByCourse(Course course);

	Optional<Assignment> findByIdAndCourseId(long assignmentId, long courseId);
	Page<Assignment> findAllByCourseOrderByDueDateDesc(Course course, Pageable pageable);

	@Query("SELECT a FROM Assignment a WHERE a.course.id IN :courseIds")
	List<Assignment> findAssignmentsByCourseIds(@Param("courseIds") List<Long> courseIds);
}
