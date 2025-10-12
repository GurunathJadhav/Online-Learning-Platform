package com.aseurotech.olp.service.impl;

import com.aseurotech.olp.entity.Course;
import com.aseurotech.olp.entity.Enrollment;
import com.aseurotech.olp.entity.Payment;
import com.aseurotech.olp.entity.User;
import com.aseurotech.olp.payload.request.ProductRequest;
import com.aseurotech.olp.payload.response.ApiResponse;
import com.aseurotech.olp.payload.response.StripeResponse;
import com.aseurotech.olp.repository.CourseRepository;
import com.aseurotech.olp.repository.EnrollmentRepository;
import com.aseurotech.olp.repository.UserRepository;
import com.aseurotech.olp.service.EnrollmentService;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class EnrollmentServiceImpl implements EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final StripeService stripeService;

    @Value("${stripe.secretKey}")
    private String secretKey;

    public EnrollmentServiceImpl(EnrollmentRepository enrollmentRepository,
                                 UserRepository userRepository,
                                 CourseRepository courseRepository,
                                 StripeService stripeService) {
        this.enrollmentRepository = enrollmentRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.stripeService = stripeService;
    }

    @Override
    public ApiResponse<String> enroll(long courseId, long userId) {
        ApiResponse<String> response=new ApiResponse<>();
        
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean alreadyEnrolled = enrollmentRepository.existsByUserIdAndCourseId(userId, courseId);
        if (alreadyEnrolled) {
            response.setMessage("Enrollment failed");
            response.setData("Enrollment with user already exists");
            response.setStatus(500);
            return response;
        }

        ProductRequest productRequest = new ProductRequest();
        productRequest.setAmount((long) (course.getPrice() * 100)); 
        productRequest.setQuantity(1L);
        productRequest.setName(course.getTitle());
        productRequest.setCurrency("inr");
        productRequest.setUserId(userId);
        productRequest.setCourseId(courseId);

        StripeResponse stripeResponse = stripeService.checkoutCourse(productRequest);
        response.setMessage(stripeResponse.getMessage());
        response.setData(stripeResponse.getSessionUrl());
        response.setStatus(200);
        return response;

    }

    @Override
    public ApiResponse<String> handlePaymentSuccess(String sessionId) {
        ApiResponse<String> response=new ApiResponse<>();
        Stripe.apiKey = secretKey;

        try {
            Session session = Session.retrieve(sessionId);
            String paymentStatus = session.getPaymentStatus();

            if (!"paid".equalsIgnoreCase(paymentStatus)) {
                response.setMessage("Payment failed");
                response.setData("Payment failed");
                response.setStatus(500);
                return response;
            }

            Long userId = Long.valueOf(session.getMetadata().get("userId"));
            Long courseId = Long.valueOf(session.getMetadata().get("courseId"));

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            Course course = courseRepository.findById(courseId)
                    .orElseThrow(() -> new RuntimeException("Course not found"));

            Enrollment enrollment = new Enrollment();
            enrollment.setUser(user);
            enrollment.setCourse(course);
            enrollment.setStatus(true);
            enrollment.setEnrolledAt(LocalDateTime.now());

            Payment payment = new Payment();
            payment.setPaymentId(session.getPaymentIntent());
            payment.setStatus(true);
            payment.setEnrollment(enrollment);
            payment.setAmout(enrollment.getCourse().getPrice());

            enrollment.setPayment(payment);
            enrollmentRepository.save(enrollment);
            response.setMessage("Payment successful");
            response.setData("Enrollment completed");
            response.setStatus(201);
            return response;


        } catch (StripeException e) {
            e.printStackTrace();
            response.setMessage("Enrollment failed");
            response.setData("Stripe error: " + e.getMessage());
            response.setStatus(500);
            return response;
        }
    }
}
