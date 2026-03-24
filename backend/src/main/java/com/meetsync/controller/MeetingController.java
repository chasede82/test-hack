package com.meetsync.controller;

import com.meetsync.dto.response.MeetingResponse;
import com.meetsync.service.MeetingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * 회의 컨트롤러 - 녹음 파일 업로드 및 회의 조회
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MeetingController {

    private final MeetingService meetingService;

    /**
     * 회의 녹음 파일 업로드
     */
    @PostMapping("/channels/{channelId}/meetings/upload")
    public ResponseEntity<MeetingResponse> uploadRecording(
            @PathVariable Long channelId,
            @RequestParam("title") String title,
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserDetails userDetails) {
        MeetingResponse response = meetingService.uploadRecording(channelId, title, file, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * 채널별 회의 목록 조회
     */
    @GetMapping("/channels/{channelId}/meetings")
    public ResponseEntity<List<MeetingResponse>> getByChannel(@PathVariable Long channelId) {
        List<MeetingResponse> responses = meetingService.getByChannel(channelId);
        return ResponseEntity.ok(responses);
    }

    /**
     * 회의 상세 조회
     */
    @GetMapping("/meetings/{id}")
    public ResponseEntity<MeetingResponse> getById(@PathVariable Long id) {
        MeetingResponse response = meetingService.getById(id);
        return ResponseEntity.ok(response);
    }
}
