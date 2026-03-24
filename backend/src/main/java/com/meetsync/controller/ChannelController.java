package com.meetsync.controller;

import com.meetsync.dto.request.CreateChannelRequest;
import com.meetsync.dto.response.ChannelResponse;
import com.meetsync.service.ChannelService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 채널 컨트롤러 - 채널 CRUD 및 멤버 관리
 */
@RestController
@RequestMapping("/api/channels")
@RequiredArgsConstructor
public class ChannelController {

    private final ChannelService channelService;

    /**
     * 채널 생성
     */
    @PostMapping
    public ResponseEntity<ChannelResponse> create(
            @Valid @RequestBody CreateChannelRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        ChannelResponse response = channelService.create(request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * 내가 속한 채널 목록 조회
     */
    @GetMapping
    public ResponseEntity<List<ChannelResponse>> list(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<ChannelResponse> responses = channelService.listForUser(userDetails.getUsername());
        return ResponseEntity.ok(responses);
    }

    /**
     * 채널 상세 조회
     */
    @GetMapping("/{id}")
    public ResponseEntity<ChannelResponse> getById(@PathVariable Long id) {
        ChannelResponse response = channelService.getById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * 채널에 멤버 추가
     */
    @PostMapping("/{id}/members")
    public ResponseEntity<ChannelResponse> addMember(
            @PathVariable Long id,
            @RequestBody Map<String, Long> request) {
        Long userId = request.get("userId");
        ChannelResponse response = channelService.addMember(id, userId);
        return ResponseEntity.ok(response);
    }
}
