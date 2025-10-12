package com.aseurotech.olp.service;

import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;

import jakarta.annotation.PostConstruct;

@Service
public class JwtService {
	
	@Value("${jwt-secret-key}")
	private String secretKay;
	
	@Value("${jwt-issuer}")
	private String issuer;
	
	@Value("${jwt-expiration-time}")
	private int expirationTime;
	
	private Algorithm algorithm;
	
	@PostConstruct
	private void setAlgorithm() {
		algorithm=Algorithm.HMAC256(secretKay);
	}
	
	
	public String generateToken(String username,String role) {
		return JWT.create()
			.withClaim("username", username)
			.withClaim("role", role)
			.withIssuer(issuer)
			.withIssuedAt(new Date())
			.withExpiresAt(new Date(System.currentTimeMillis()+expirationTime))
			.sign(algorithm);
	}
	
	public String validateAndRetrieveUsername(String token) {
		DecodedJWT verify = JWT.require(algorithm).build().verify(token);
		return verify.getClaim("username").asString();
	}
	
	public String validateAndRetrieveRole(String token) {
		DecodedJWT verify = JWT.require(algorithm).build().verify(token);
		return verify.getClaim("role").asString();
	}

}
