package com.meetsync.controller;

import com.meetsync.dto.response.MessageResponse;
import com.meetsync.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 메시지 컨트롤러 - REST API를 통한 메시지 이력 조회
 */
@RestController
@RequestMapping("/api/channels")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    /**
     * 채널 메시지 이력 조회 (페이징)
     */
    @GetMapping("/{channelId}/messages")
    public ResponseEntity<Page<MessageResponse>> getByChannel(
            @PathVariable Long channelId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        Page<MessageResponse> responses = messageService.getByChannel(channelId, page, size);
        return ResponseEntity.ok(responses);
    }
}
