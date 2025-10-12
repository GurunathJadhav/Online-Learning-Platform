package com.aseurotech.olp.service;


import java.util.Collection;
import java.util.stream.Collectors;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.aseurotech.olp.entity.User;
import com.aseurotech.olp.repository.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService{

	
	private final UserRepository repository;
	
	public CustomUserDetailsService(UserRepository repository) {
		this.repository = repository;
		
	}



	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		User user = repository.findByUsername(username).orElseThrow(()->
			new BadCredentialsException("User data not found"));
		
		 Collection<? extends GrantedAuthority> authorities = user.getUserRoles()
	                .stream()
	                .map(userRole -> new SimpleGrantedAuthority("ROLE_" + userRole.getRole().getName()))
	                .collect(Collectors.toSet());
		 
		return new org.springframework.security.core.userdetails.User(user.getUsername(),user.getPassword(),authorities);
	}

}
