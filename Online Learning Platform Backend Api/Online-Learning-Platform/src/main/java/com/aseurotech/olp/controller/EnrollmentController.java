package com.aseurotech.olp.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

import com.aseurotech.olp.payload.response.ApiResponse;
import com.aseurotech.olp.service.EnrollmentService;

@RestController
@RequestMapping("/api/olp/enrollment")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    public EnrollmentController(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    @PostMapping("/enroll")
    public ResponseEntity<ApiResponse<String>> startEnrollment(
            @RequestParam long courseId,
            @RequestParam long userId) {
        ApiResponse<String> response = enrollmentService.enroll(courseId, userId);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/success")
    public RedirectView handlePaymentSuccess(@RequestParam("session_id") String sessionId) {
        try {
            enrollmentService.handlePaymentSuccess(sessionId);

            return new RedirectView("http://localhost:3000/payment-success");
        } catch (Exception e) {
            e.printStackTrace();
            return new RedirectView("http://localhost:3000/payment-failed");
        }
    }

    @GetMapping("/cancel")
    public RedirectView handlePaymentCancel() {
        return new RedirectView("http://localhost:3000/payment-cancel");
    }
}
