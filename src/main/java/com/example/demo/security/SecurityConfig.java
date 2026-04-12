package com.example.demo.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Disable CSRF since we use JWT
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth", "/api/auth/**").permitAll()
                        .requestMatchers("/api/hotels", "/api/hotels/**").permitAll()
                        .requestMatchers("/api/room-types", "/api/room-types/**").permitAll()
                        .requestMatchers("/api/flights", "/api/flights/**").permitAll()
                        .requestMatchers("/api/cars", "/api/cars/**").permitAll()
                        .requestMatchers("/api/attractions", "/api/attractions/**").permitAll()
                        .requestMatchers("/api/airport-taxis", "/api/airport-taxis/**").permitAll()
                        .requestMatchers("/api/payment", "/api/payment/**").permitAll() // Thêm cổng thanh toán
                        .requestMatchers("/api/email", "/api/email/**").permitAll() // API gửi email
                        .requestMatchers("/api/chat", "/api/chat/**").permitAll() // API cho Chatbot AI
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/bookings/status/**").permitAll() // Cho phép polling status không cần token
                        .requestMatchers("/", "/index.html", "/css/**", "/js/**", "/images/**").permitAll() // Mở khóa trang chủ
                        .requestMatchers("/error").permitAll()
                        .anyRequest().authenticated() // Cần đăng nhập để dùng các API còn lại (như đặt phòng)
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // Tắt session, 100% Stateless
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // Mã hóa mật khẩu
    }
}
