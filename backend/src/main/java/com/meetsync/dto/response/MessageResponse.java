package com.meetsync.dto.response;

import com.meetsync.domain.Message;
import com.meetsync.domain.MessageType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponse {

    private Long id;
    private String content;
    private String senderName;
    private Long senderId;
    private MessageType messageType;
    private LocalDateTime createdAt;

    public static MessageResponse from(Message message) {
        return MessageResponse.builder()
                .id(message.getId())
                .content(message.getContent())
                .senderName(message.getSender().getName())
                .senderId(message.getSender().getId())
                .messageType(message.getMessageType())
                .createdAt(message.getCreatedAt())
                .build();
    }
}
