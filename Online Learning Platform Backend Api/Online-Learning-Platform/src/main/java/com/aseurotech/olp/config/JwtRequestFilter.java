package com.aseurotech.olp.config;

import java.io.IOException;
import java.util.Collection;
import java.util.stream.Collectors;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.aseurotech.olp.service.CustomUserDetailsService;
import com.aseurotech.olp.service.JwtService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {
	
	private final CustomUserDetailsService customUserDetailsService;
	private final JwtService jwtService;
	

	public JwtRequestFilter(CustomUserDetailsService customUserDetailsService, JwtService jwtService) {
		super();
		this.customUserDetailsService = customUserDetailsService;
		this.jwtService = jwtService;
	}


	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		
		String headerToken = request.getHeader("Authorization");
		if(headerToken!=null && headerToken.startsWith("Bearer ")) {
			
			String token = headerToken.substring(7);
			
			String username = jwtService.validateAndRetrieveUsername(token);
			if(username!=null && SecurityContextHolder.getContext().getAuthentication()==null) {
				UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);
				
				 Collection<? extends GrantedAuthority> authorities = userDetails.getAuthorities()
			                .stream()
			                .map(userRole -> new SimpleGrantedAuthority(userRole.getAuthority()))
			                .collect(Collectors.toSet());
				 
				 UsernamePasswordAuthenticationToken authToken=
						 new UsernamePasswordAuthenticationToken(userDetails, null,authorities);
				 
				 authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
				 SecurityContextHolder.getContext().setAuthentication(authToken);	 
				
			}
			
		}
		filterChain.doFilter(request, response);
		
	}

}
