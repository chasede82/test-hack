package com.meetsync.controller;

import com.meetsync.dto.response.MeetingMinutesResponse;
import com.meetsync.dto.response.MeetingResponse;
import com.meetsync.service.MeetingMinutesService;
import com.meetsync.service.MeetingService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MeetingController {

    private final MeetingService meetingService;
    private final MeetingMinutesService meetingMinutesService;

    @Value("${file.upload-dir}")
    private String uploadDir;

    /**
     * 회의 녹음 파일 업로드 + AI 자동 처리
     */
    @PostMapping("/channels/{channelId}/meetings/upload")
    public ResponseEntity<MeetingMinutesResponse> uploadRecording(
            @PathVariable Long channelId,
            @RequestParam("title") String title,
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserDetails userDetails) {
        MeetingResponse meetingResponse = meetingService.uploadRecording(channelId, title, file, userDetails.getUsername());
        // 업로드 후 자동으로 AI 처리 시작
        MeetingMinutesResponse minutesResponse = meetingMinutesService.generate(meetingResponse.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(minutesResponse);
    }

    @GetMapping("/channels/{channelId}/meetings")
    public ResponseEntity<List<MeetingResponse>> getByChannel(@PathVariable Long channelId) {
        List<MeetingResponse> responses = meetingService.getByChannel(channelId);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/meetings/{id}")
    public ResponseEntity<MeetingResponse> getById(@PathVariable Long id) {
        MeetingResponse response = meetingService.getById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * 녹음 파일 다운로드
     */
    @GetMapping("/meetings/{id}/download")
    public ResponseEntity<Resource> downloadRecording(@PathVariable Long id) {
        MeetingResponse meeting = meetingService.getById(id);
        String filename = meeting.getRecordingUrl();
        if (filename == null || filename.isBlank()) {
            return ResponseEntity.notFound().build();
        }

        try {
            Path filePath = Paths.get(uploadDir).resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }

            String contentType = "application/octet-stream";
            if (filename.endsWith(".mp3")) contentType = "audio/mpeg";
            else if (filename.endsWith(".mp4")) contentType = "audio/mp4";
            else if (filename.endsWith(".wav")) contentType = "audio/wav";
            else if (filename.endsWith(".m4a")) contentType = "audio/mp4";

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .body(resource);
        } catch (MalformedURLException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
