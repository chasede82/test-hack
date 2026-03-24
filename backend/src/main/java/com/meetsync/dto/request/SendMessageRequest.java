package com.meetsync.dto.request;

import com.meetsync.domain.MessageType;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SendMessageRequest {

    @NotBlank(message = "메시지 내용은 필수입니다")
    private String content;

    private MessageType messageType = MessageType.TEXT;
}
