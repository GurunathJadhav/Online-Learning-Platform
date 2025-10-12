package com.aseurotech.olp.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aseurotech.olp.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

}
