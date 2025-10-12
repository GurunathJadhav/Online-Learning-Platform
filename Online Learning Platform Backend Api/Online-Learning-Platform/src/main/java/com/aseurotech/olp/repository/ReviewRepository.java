package com.aseurotech.olp.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aseurotech.olp.entity.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {

}
