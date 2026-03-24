package com.meetsync.controller;

import com.meetsync.dto.request.SendMessageRequest;
import com.meetsync.dto.response.MessageResponse;
import com.meetsync.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import java.security.Principal;

/**
 * WebSocket STOMP 채팅 컨트롤러
 * 클라이언트는 /app/chat.send/{channelId}로 메시지를 보내고,
 * /topic/channel/{channelId}를 구독하여 메시지를 수신
 */
@Slf4j
@Controller
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    /**
     * 채널에 메시지 전송
     * STOMP destination: /app/chat.send/{channelId}
     * 브로드캐스트 destination: /topic/channel/{channelId}
     */
    @MessageMapping("/chat.send/{channelId}")
    @SendTo("/topic/channel/{channelId}")
    public MessageResponse sendMessage(
            @DestinationVariable Long channelId,
            SendMessageRequest request,
            SimpMessageHeaderAccessor headerAccessor) {

        Principal principal = headerAccessor.getUser();
        String senderEmail = principal != null ? principal.getName() : "anonymous";

        log.debug("WebSocket 메시지 수신 - channelId: {}, sender: {}", channelId, senderEmail);

        return chatService.processAndBroadcast(channelId, request, senderEmail);
    }
}
