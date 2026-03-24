package com.meetsync.service;

import com.meetsync.domain.Channel;
import com.meetsync.domain.User;
import com.meetsync.dto.request.CreateChannelRequest;
import com.meetsync.dto.response.ChannelResponse;
import com.meetsync.exception.BadRequestException;
import com.meetsync.exception.ResourceNotFoundException;
import com.meetsync.repository.ChannelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 채널 서비스 - 채널 생성, 조회, 멤버 관리
 */
@Service
@RequiredArgsConstructor
public class ChannelService {

    private final ChannelRepository channelRepository;
    private final UserService userService;

    /**
     * 채널 생성 - 생성자를 자동으로 멤버에 추가
     */
    @Transactional
    public ChannelResponse create(CreateChannelRequest request, String userEmail) {
        User user = userService.findByEmail(userEmail);

        Channel channel = Channel.builder()
                .name(request.getName())
                .description(request.getDescription())
                .createdBy(user)
                .build();

        // 생성자를 멤버로 자동 추가
        channel.getMembers().add(user);

        channel = channelRepository.save(channel);
        return ChannelResponse.from(channel);
    }

    /**
     * 사용자가 속한 채널 목록 조회
     */
    @Transactional(readOnly = true)
    public List<ChannelResponse> listForUser(String userEmail) {
        User user = userService.findByEmail(userEmail);
        return channelRepository.findByMembersContaining(user).stream()
                .map(ChannelResponse::from)
                .collect(Collectors.toList());
    }

    /**
     * 채널 단건 조회
     */
    @Transactional(readOnly = true)
    public ChannelResponse getById(Long id) {
        Channel channel = findChannelById(id);
        return ChannelResponse.from(channel);
    }

    /**
     * 채널에 멤버 추가
     */
    @Transactional
    public ChannelResponse addMember(Long channelId, Long userId) {
        Channel channel = findChannelById(channelId);
        User user = userService.findById(userId);

        if (channel.getMembers().contains(user)) {
            throw new BadRequestException("이미 채널에 참여 중인 사용자입니다");
        }

        channel.getMembers().add(user);
        channel = channelRepository.save(channel);
        return ChannelResponse.from(channel);
    }

    /**
     * 채널 엔티티 조회 (내부 사용)
     */
    public Channel findChannelById(Long id) {
        return channelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("채널", "id", id));
    }
}
