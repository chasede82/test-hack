package com.meetsync.service;

import com.meetsync.domain.Channel;
import com.meetsync.domain.Message;
import com.meetsync.domain.MessageType;
import com.meetsync.domain.User;
import com.meetsync.dto.request.SendMessageRequest;
import com.meetsync.dto.response.MessageResponse;
import com.meetsync.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 채팅 서비스 - WebSocket 메시지 처리 및 브로드캐스트
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ChatService {

    private final MessageRepository messageRepository;
    private final ChannelService channelService;
    private final UserService userService;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * 메시지 처리 - 저장 및 채널 구독자에게 브로드캐스트
     */
    @Transactional
    public MessageResponse processAndBroadcast(Long channelId, SendMessageRequest request, String senderEmail) {
        Channel channel = channelService.findChannelById(channelId);
        User sender = userService.findByEmail(senderEmail);

        // 메시지 저장
        Message message = Message.builder()
                .content(request.getContent())
                .channel(channel)
                .sender(sender)
                .messageType(request.getMessageType() != null ? request.getMessageType() : MessageType.TEXT)
                .build();

        message = messageRepository.save(message);
        MessageResponse response = MessageResponse.from(message);

        // 채널 구독자에게 브로드캐스트
        messagingTemplate.convertAndSend("/topic/channel/" + channelId, response);

        log.debug("메시지 브로드캐스트 완료 - channelId: {}, senderId: {}", channelId, sender.getId());

        return response;
    }

    /**
     * 시스템 메시지 전송 (입장/퇴장 등)
     */
    public void sendSystemMessage(Long channelId, String content) {
        MessageResponse systemMessage = MessageResponse.builder()
                .content(content)
                .senderName("System")
                .messageType(MessageType.SYSTEM)
                .build();

        messagingTemplate.convertAndSend("/topic/channel/" + channelId, systemMessage);
    }
}
