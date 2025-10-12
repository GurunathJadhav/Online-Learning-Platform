package com.aseurotech.olp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aseurotech.olp.entity.Lesson;

public interface LessonRepository extends JpaRepository<Lesson, Long> {

	List<Lesson> findAllByModuleId(long id);

}
