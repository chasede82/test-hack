package com.meetsync.service;

import com.meetsync.domain.Channel;
import com.meetsync.domain.Message;
import com.meetsync.domain.User;
import com.meetsync.dto.request.SendMessageRequest;
import com.meetsync.dto.response.MessageResponse;
import com.meetsync.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 메시지 서비스 - 채널 메시지 저장 및 조회
 */
@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final ChannelService channelService;
    private final UserService userService;

    /**
     * 채널 메시지 목록 조회 (페이징)
     */
    @Transactional(readOnly = true)
    public Page<MessageResponse> getByChannel(Long channelId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return messageRepository.findByChannelIdOrderByCreatedAtDesc(channelId, pageable)
                .map(MessageResponse::from);
    }

    /**
     * 메시지 저장
     */
    @Transactional
    public MessageResponse save(Long channelId, SendMessageRequest request, String senderEmail) {
        Channel channel = channelService.findChannelById(channelId);
        User sender = userService.findByEmail(senderEmail);

        Message message = Message.builder()
                .content(request.getContent())
                .channel(channel)
                .sender(sender)
                .messageType(request.getMessageType())
                .build();

        message = messageRepository.save(message);
        return MessageResponse.from(message);
    }
}
