package com.meetsync.service;

import com.meetsync.config.JwtTokenProvider;
import com.meetsync.domain.User;
import com.meetsync.dto.request.LoginRequest;
import com.meetsync.dto.request.SignupRequest;
import com.meetsync.dto.response.AuthResponse;
import com.meetsync.dto.response.UserResponse;
import com.meetsync.exception.BadRequestException;
import com.meetsync.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 인증 서비스 - 회원가입, 로그인
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    /**
     * 회원가입
     */
    @Transactional
    public AuthResponse signup(SignupRequest request) {
        // 이메일 중복 확인
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("이미 사용 중인 이메일입니다: " + request.getEmail());
        }

        // 사용자 생성
        User user = User.builder()
                .email(request.getEmail())
                .name(request.getName())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        user = userRepository.save(user);

        // JWT 토큰 생성
        String token = jwtTokenProvider.generateToken(user.getEmail());

        return new AuthResponse(token, UserResponse.from(user));
    }

    /**
     * 로그인
     */
    public AuthResponse login(LoginRequest request) {
        // 인증 수행
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        // JWT 토큰 생성
        String token = jwtTokenProvider.generateToken(authentication);

        // 사용자 정보 조회
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("사용자를 찾을 수 없습니다"));

        return new AuthResponse(token, UserResponse.from(user));
    }
}
