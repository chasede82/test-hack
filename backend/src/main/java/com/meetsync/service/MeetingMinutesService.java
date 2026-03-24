package com.meetsync.service;

import com.meetsync.domain.*;
import com.meetsync.dto.response.MeetingMinutesResponse;
import com.meetsync.dto.response.TodoResponse;
import com.meetsync.exception.BadRequestException;
import com.meetsync.exception.ResourceNotFoundException;
import com.meetsync.repository.MeetingMinutesRepository;
import com.meetsync.repository.MeetingRepository;
import com.meetsync.repository.TodoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MeetingMinutesService {

    private final MeetingMinutesRepository meetingMinutesRepository;
    private final MeetingRepository meetingRepository;
    private final TodoRepository todoRepository;
    private final MeetingService meetingService;
    private final AiService aiService;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Value("${ai.local.enabled:true}")
    private boolean localAiEnabled;

    @Transactional
    public MeetingMinutesResponse generate(Long meetingId) {
        Meeting meeting = meetingService.findMeetingById(meetingId);

        if (meeting.getStatus() == MeetingStatus.COMPLETED) {
            throw new BadRequestException("이미 처리가 완료된 회의입니다");
        }

        meeting.setStatus(MeetingStatus.PROCESSING);
        meetingRepository.save(meeting);

        try {
            String transcript;
            String minutesJson;

            // 로컬 AI (Whisper + Ollama) 사용
            File audioFile = Paths.get(uploadDir).toAbsolutePath().normalize()
                    .resolve(meeting.getRecordingUrl()).toFile();

            if (!audioFile.exists()) {
                throw new BadRequestException("녹음 파일을 찾을 수 없습니다: " + meeting.getRecordingUrl());
            }

            log.info("로컬 AI로 회의록 생성 시작 - file: {}", audioFile.getName());
            transcript = aiService.transcribe(audioFile);
            minutesJson = aiService.generateMinutes(transcript, meeting.getTitle());

            meeting.setTranscript(transcript);

            // Parse AI response JSON
            JSONObject json = new JSONObject(minutesJson);

            String summary = json.getString("summary");

            String discussions = json.getJSONArray("discussions").toString();
            String decisions = json.getJSONArray("decisions").toString();

            MeetingMinutes minutes = MeetingMinutes.builder()
                    .meeting(meeting)
                    .summary(summary)
                    .discussions(discussions)
                    .decisions(decisions)
                    .build();

            minutes = meetingMinutesRepository.save(minutes);

            // Create todos from AI response
            JSONArray todosArray = json.getJSONArray("todos");
            User creator = meeting.getCreatedBy();

            for (int i = 0; i < todosArray.length(); i++) {
                JSONObject todoJson = todosArray.getJSONObject(i);
                String content = todoJson.getString("content");
                String assignee = todoJson.optString("assignee", "미정");

                LocalDate dueDate = null;
                if (!todoJson.isNull("dueDate")) {
                    try {
                        dueDate = LocalDate.parse(todoJson.getString("dueDate"));
                    } catch (Exception e) {
                        dueDate = LocalDate.now().plusDays(7);
                    }
                }

                Todo todo = Todo.builder()
                        .content(content + (!"미정".equals(assignee) ? " (담당: " + assignee + ")" : ""))
                        .assignee(creator)
                        .meeting(meeting)
                        .dueDate(dueDate != null ? dueDate : LocalDate.now().plusDays(7))
                        .completed(false)
                        .build();

                todoRepository.save(todo);
            }

            meeting.setStatus(MeetingStatus.COMPLETED);
            meetingRepository.save(meeting);

            List<TodoResponse> todoResponses = todoRepository.findByMeetingId(meetingId).stream()
                    .map(TodoResponse::from)
                    .collect(Collectors.toList());

            log.info("회의록 생성 완료 - meetingId: {}", meetingId);
            return MeetingMinutesResponse.from(minutes, todoResponses);

        } catch (Exception e) {
            meeting.setStatus(MeetingStatus.FAILED);
            meetingRepository.save(meeting);
            log.error("회의록 생성 실패 - meetingId: {}", meetingId, e);
            throw new BadRequestException("회의록 생성에 실패했습니다: " + e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public MeetingMinutesResponse getByMeeting(Long meetingId) {
        MeetingMinutes minutes = meetingMinutesRepository.findByMeetingId(meetingId)
                .orElseThrow(() -> new ResourceNotFoundException("회의록", "meetingId", meetingId));

        List<TodoResponse> todoResponses = todoRepository.findByMeetingId(meetingId).stream()
                .map(TodoResponse::from)
                .collect(Collectors.toList());

        return MeetingMinutesResponse.from(minutes, todoResponses);
    }

    // ===== Fallback Mock 데이터 =====

    private String generateMockTranscript(String title) {
        return String.format(
                "[00:00] 안녕하세요, '%s' 회의를 시작하겠습니다.\n" +
                "[00:30] 먼저 지난 주 진행 상황을 공유해 주세요.\n" +
                "[02:15] 프론트엔드 개발이 80%% 완료되었습니다.\n" +
                "[03:00] 백엔드 API는 이번 주 내로 마무리할 예정입니다.\n" +
                "[05:30] QA 테스트 일정을 다음 주로 잡겠습니다.\n" +
                "[07:00] 다음 회의는 수요일에 진행하겠습니다. 수고하셨습니다.", title);
    }

    private String generateMockMinutesJson(String title) {
        return String.format("""
                {
                  "summary": "'%s' 회의에서는 프로젝트 진행 상황을 점검하고 향후 일정을 조율했습니다. 프론트엔드 개발은 순조롭게 진행 중이며, 백엔드 API 완료 후 QA 테스트를 진행할 예정입니다.",
                  "discussions": [
                    {"topic": "프론트엔드 개발 현황", "detail": "전체 기능의 80%% 구현 완료. UI/UX 개선 사항 논의"},
                    {"topic": "백엔드 API 개발", "detail": "주요 API 개발 완료. 인증 및 파일 업로드 기능 추가 예정"},
                    {"topic": "QA 테스트 계획", "detail": "다음 주 월요일부터 QA 테스트 시작 예정"}
                  ],
                  "decisions": [
                    {"decision": "백엔드 API 이번 주 금요일까지 완료"},
                    {"decision": "QA 테스트 다음 주 월요일 시작"},
                    {"decision": "다음 회의는 수요일 오후 2시 진행"}
                  ],
                  "todos": [
                    {"content": "백엔드 API 개발 완료", "assignee": "미정", "dueDate": null},
                    {"content": "QA 테스트 케이스 작성", "assignee": "미정", "dueDate": null},
                    {"content": "프론트엔드 UI/UX 개선", "assignee": "미정", "dueDate": null}
                  ]
                }
                """, title);
    }
}
