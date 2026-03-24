package com.meetsync.service;

import com.meetsync.domain.Channel;
import com.meetsync.domain.Meeting;
import com.meetsync.domain.MeetingStatus;
import com.meetsync.domain.User;
import com.meetsync.dto.response.MeetingResponse;
import com.meetsync.exception.BadRequestException;
import com.meetsync.exception.ResourceNotFoundException;
import com.meetsync.repository.MeetingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * 회의 서비스 - 녹음 파일 업로드 및 회의 관리
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class MeetingService {

    private final MeetingRepository meetingRepository;
    private final ChannelService channelService;
    private final UserService userService;

    @Value("${file.upload-dir}")
    private String uploadDir;

    // 허용되는 파일 확장자
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("mp3", "mp4", "wav", "m4a");

    /**
     * 녹음 파일 업로드 및 회의 생성
     */
    @Transactional
    public MeetingResponse uploadRecording(Long channelId, String title, MultipartFile file, String userEmail) {
        // 파일 유효성 검증
        validateFile(file);

        Channel channel = channelService.findChannelById(channelId);
        User user = userService.findByEmail(userEmail);

        // 파일 저장
        String storedFileName = storeFile(file);

        // 회의 엔티티 생성
        Meeting meeting = Meeting.builder()
                .title(title)
                .channel(channel)
                .recordingUrl(storedFileName)
                .status(MeetingStatus.UPLOADING)
                .createdBy(user)
                .build();

        meeting = meetingRepository.save(meeting);

        // 업로드 완료 상태로 변경
        meeting.setStatus(MeetingStatus.PROCESSING);
        meeting = meetingRepository.save(meeting);

        log.info("회의 녹음 파일 업로드 완료 - meetingId: {}, fileName: {}", meeting.getId(), storedFileName);

        return MeetingResponse.from(meeting);
    }

    /**
     * 채널별 회의 목록 조회
     */
    @Transactional(readOnly = true)
    public List<MeetingResponse> getByChannel(Long channelId) {
        return meetingRepository.findByChannelId(channelId).stream()
                .map(MeetingResponse::from)
                .collect(Collectors.toList());
    }

    /**
     * 회의 단건 조회
     */
    @Transactional(readOnly = true)
    public MeetingResponse getById(Long id) {
        Meeting meeting = findMeetingById(id);
        return MeetingResponse.from(meeting);
    }

    /**
     * 회의 엔티티 조회 (내부 사용)
     */
    public Meeting findMeetingById(Long id) {
        return meetingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("회의", "id", id));
    }

    /**
     * 파일 유효성 검증
     */
    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new BadRequestException("업로드할 파일이 비어있습니다");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            throw new BadRequestException("파일 이름이 없습니다");
        }

        String extension = getFileExtension(originalFilename).toLowerCase();
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new BadRequestException("지원하지 않는 파일 형식입니다. 허용 형식: " + ALLOWED_EXTENSIONS);
        }
    }

    /**
     * 파일 저장
     */
    private String storeFile(MultipartFile file) {
        try {
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);

            String originalFilename = file.getOriginalFilename();
            String extension = getFileExtension(originalFilename);
            String storedFileName = UUID.randomUUID().toString() + "." + extension;

            Path targetLocation = uploadPath.resolve(storedFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return storedFileName;
        } catch (IOException ex) {
            throw new BadRequestException("파일 저장에 실패했습니다: " + ex.getMessage());
        }
    }

    /**
     * 파일 확장자 추출
     */
    private String getFileExtension(String filename) {
        int dotIndex = filename.lastIndexOf('.');
        if (dotIndex == -1) {
            return "";
        }
        return filename.substring(dotIndex + 1);
    }
}
