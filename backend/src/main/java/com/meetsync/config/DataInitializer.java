package com.meetsync.config;

import com.meetsync.domain.Channel;
import com.meetsync.domain.User;
import com.meetsync.repository.ChannelRepository;
import com.meetsync.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ChannelRepository channelRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // 테스트 계정 생성
        User admin = User.builder()
                .email("admin@meetsync.com")
                .name("관리자")
                .password(passwordEncoder.encode("admin123"))
                .build();
        admin = userRepository.save(admin);

        User user1 = User.builder()
                .email("test@test.com")
                .name("테스트유저")
                .password(passwordEncoder.encode("password123"))
                .build();
        user1 = userRepository.save(user1);

        User user2 = User.builder()
                .email("dev@meetsync.com")
                .name("개발자")
                .password(passwordEncoder.encode("dev123"))
                .build();
        user2 = userRepository.save(user2);

        User test1 = User.builder()
                .email("test1@test.com")
                .name("테스트1")
                .password(passwordEncoder.encode("password123"))
                .build();
        test1 = userRepository.save(test1);

        User test2 = User.builder()
                .email("test2@test.com")
                .name("테스트2")
                .password(passwordEncoder.encode("password123"))
                .build();
        test2 = userRepository.save(test2);

        // 기본 채널 생성
        Channel devChannel = Channel.builder()
                .name("개발팀")
                .description("개발팀 채널")
                .createdBy(admin)
                .build();
        devChannel.getMembers().add(admin);
        devChannel.getMembers().add(user1);
        devChannel.getMembers().add(user2);
        devChannel.getMembers().add(test1);
        devChannel.getMembers().add(test2);
        channelRepository.save(devChannel);

        Channel generalChannel = Channel.builder()
                .name("일반")
                .description("일반 대화 채널")
                .createdBy(admin)
                .build();
        generalChannel.getMembers().add(admin);
        generalChannel.getMembers().add(user1);
        channelRepository.save(generalChannel);

        log.info("=== 초기 데이터 생성 완료 ===");
        log.info("계정 1: admin@meetsync.com / admin123 (관리자)");
        log.info("계정 2: test@test.com / password123 (테스트유저)");
        log.info("계정 3: dev@meetsync.com / dev123 (개발자)");
        log.info("계정 4: test1@test.com / password123 (테스트1)");
        log.info("계정 5: test2@test.com / password123 (테스트2)");
        log.info("채널: 개발팀, 일반");
    }
}
