package com.meetsync.controller;

import com.meetsync.dto.response.MeetingMinutesResponse;
import com.meetsync.service.MeetingMinutesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 회의록 컨트롤러 - AI 처리 트리거 및 회의록 조회
 */
@RestController
@RequestMapping("/api/meetings")
@RequiredArgsConstructor
public class MeetingMinutesController {

    private final MeetingMinutesService meetingMinutesService;

    /**
     * AI 처리 트리거 - 회의록 및 할일 자동 생성
     */
    @PostMapping("/{meetingId}/process")
    public ResponseEntity<MeetingMinutesResponse> process(@PathVariable Long meetingId) {
        MeetingMinutesResponse response = meetingMinutesService.generate(meetingId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * 회의록 조회
     */
    @GetMapping("/{meetingId}/minutes")
    public ResponseEntity<MeetingMinutesResponse> getByMeeting(@PathVariable Long meetingId) {
        MeetingMinutesResponse response = meetingMinutesService.getByMeeting(meetingId);
        return ResponseEntity.ok(response);
    }
}
