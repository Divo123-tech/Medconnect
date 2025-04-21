package com.backend.server.config;

import com.backend.server.entities.User;
import com.backend.server.services.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;


    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        //get the bearer token from the request header
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        //if the auth header is empty or doesn't start with bearer
        if(authHeader == null || !authHeader.startsWith("Bearer ")){
            //pass the request and response along
            filterChain.doFilter(request, response);
            return;
        }

        //get the jwt token from 7 which is removing Bearer and space
        jwt = authHeader.substring(7);
        userEmail = jwtService.extractUserName(jwt);
        //if the user is not authenticated
        if(userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null){
            //get the details from the database
            UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);
            //if the user is valid
            if(jwtService.isTokenValid(jwt, userDetails)){
                //create a valid authentication token
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );
                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );

                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
            filterChain.doFilter(request,response);
        }
    }
}
