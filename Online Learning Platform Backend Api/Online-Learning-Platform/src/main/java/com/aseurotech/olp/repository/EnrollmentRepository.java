package com.aseurotech.olp.repository;

import java.util.List;
import java.util.Optional;

import com.aseurotech.olp.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import com.aseurotech.olp.entity.Enrollment;
import com.aseurotech.olp.entity.User;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

	boolean existsByUserIdAndCourseId(long userId, long courseId);

	Optional<Enrollment> findByUser(User user);

	Optional<Enrollment> findByUserIdAndCourseId(long userId, long courseId);

    int countByCourseId(long id);

	List<Enrollment> findByCourse(Course course);
}
