package com.studyplatform.studyplatform.Config.security;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.studyplatform.studyplatform.Service.CustomUserDetailsService;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

  @Autowired
  private CustomUserDetailsService userDetailsService;
  
  @Autowired
  private JwtAuthenticationFilter jwtAuthenticationFilter;
  
  @Autowired
  private OAuth2SuccessHandler oAuth2SuccessHandler;

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
      http
          .cors().and()
          .csrf().disable()
          .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
          .and()
          .authorizeHttpRequests(authorize -> authorize
              .antMatchers(
                  "/api/auth/**", 
                  "/api/users/reset-password", // Explicitly permit this endpoint
                  "/oauth2/**",
                  "/login/oauth2/code/*",
                  "/api/files/**" // Allow anonymous access to files
              ).permitAll()
              .antMatchers("/api/documents/**").authenticated() // Documents endpoints
              .antMatchers("/api/comments/**").authenticated() // Comments endpoints
              .anyRequest().authenticated()
          )
          .oauth2Login()
              .successHandler(oAuth2SuccessHandler)
          .and()
          .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
          
      return http.build();
  }

  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
      return authConfig.getAuthenticationManager();
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
      return new BCryptPasswordEncoder();
  }
  
  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
      CorsConfiguration configuration = new CorsConfiguration();
      configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
      configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
      configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With"));
      configuration.setAllowCredentials(true);
      
      UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
      source.registerCorsConfiguration("/**", configuration);
      return source;
  }
}

