package com.aseurotech.olp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aseurotech.olp.entity.Submission;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {

	List<Submission> findAllByAssignmentId(long assignmentId);

	List<Submission> findByUserId(long userId);
}
