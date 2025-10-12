package com.aseurotech.olp.service.impl;

import com.aseurotech.olp.payload.request.ProductRequest;
import com.aseurotech.olp.payload.response.StripeResponse;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


@Service
public class StripeService {

    @Value("${stripe.secretKey}")
    private String secretKey;

    public StripeResponse checkoutCourse(ProductRequest productRequest) {
        Stripe.apiKey = secretKey;

        SessionCreateParams.LineItem.PriceData.ProductData productData =
                SessionCreateParams.LineItem.PriceData.ProductData.builder()
                        .setName(productRequest.getName())
                        .build();

        SessionCreateParams.LineItem.PriceData priceData =
                SessionCreateParams.LineItem.PriceData.builder()
                .setCurrency(
                	    productRequest.getCurrency() != null
                	        ? productRequest.getCurrency().equalsIgnoreCase("usd") 
                	            ? "inr" 
                	            : productRequest.getCurrency() 
                	        : "inr"
                	)
                        .setUnitAmount(productRequest.getAmount())
                        .setProductData(productData)
                        .build();

        SessionCreateParams.LineItem lineItem =
                SessionCreateParams.LineItem.builder()
                        .setQuantity(productRequest.getQuantity())
                        .setPriceData(priceData)
                        .build();

        // Store userId & courseId in metadata
        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl("http://localhost:8080/api/olp/enrollment/success?session_id={CHECKOUT_SESSION_ID}")
                .setCancelUrl("http://localhost:8080/api/olp/enrollment/cancel")
                .addLineItem(lineItem)
                .putMetadata("userId", String.valueOf(productRequest.getUserId()))
                .putMetadata("courseId", String.valueOf(productRequest.getCourseId()))
                .build();

        try {
            Session session = Session.create(params);

            StripeResponse stripeResponse = new StripeResponse();
            stripeResponse.setStatus("SUCCESS");
            stripeResponse.setMessage("Stripe checkout session created");
            stripeResponse.setSessionId(session.getId());
            stripeResponse.setSessionUrl(session.getUrl());
            return stripeResponse;

        } catch (StripeException e) {
            e.printStackTrace();

            StripeResponse stripeResponse = new StripeResponse();
            stripeResponse.setStatus("FAILED");
            stripeResponse.setMessage("Stripe error: " + e.getMessage());
            return stripeResponse;
        }

    }
}
