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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 회의록 서비스 - AI 처리 시뮬레이션 및 회의록 관리
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class MeetingMinutesService {

    private final MeetingMinutesRepository meetingMinutesRepository;
    private final MeetingRepository meetingRepository;
    private final TodoRepository todoRepository;
    private final MeetingService meetingService;

    /**
     * AI 처리 시뮬레이션 - 회의록 및 할일 자동 생성
     * 실제 환경에서는 STT + LLM API 호출로 대체
     */
    @Transactional
    public MeetingMinutesResponse generate(Long meetingId) {
        Meeting meeting = meetingService.findMeetingById(meetingId);

        // 이미 처리된 회의인지 확인
        if (meeting.getStatus() == MeetingStatus.COMPLETED) {
            throw new BadRequestException("이미 처리가 완료된 회의입니다");
        }

        // 상태를 PROCESSING으로 변경
        meeting.setStatus(MeetingStatus.PROCESSING);
        meetingRepository.save(meeting);

        try {
            // Mock 트랜스크립트 생성
            String mockTranscript = generateMockTranscript(meeting.getTitle());
            meeting.setTranscript(mockTranscript);

            // Mock 회의록 생성
            MeetingMinutes minutes = MeetingMinutes.builder()
                    .meeting(meeting)
                    .summary(generateMockSummary(meeting.getTitle()))
                    .discussions(generateMockDiscussions(meeting.getTitle()))
                    .decisions(generateMockDecisions(meeting.getTitle()))
                    .build();

            minutes = meetingMinutesRepository.save(minutes);

            // Mock 할일 항목 생성
            createMockTodos(meeting);

            // 처리 완료 상태로 변경
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

    /**
     * 회의별 회의록 조회
     */
    @Transactional(readOnly = true)
    public MeetingMinutesResponse getByMeeting(Long meetingId) {
        MeetingMinutes minutes = meetingMinutesRepository.findByMeetingId(meetingId)
                .orElseThrow(() -> new ResourceNotFoundException("회의록", "meetingId", meetingId));

        List<TodoResponse> todoResponses = todoRepository.findByMeetingId(meetingId).stream()
                .map(TodoResponse::from)
                .collect(Collectors.toList());

        return MeetingMinutesResponse.from(minutes, todoResponses);
    }

    // ===== Mock 데이터 생성 메서드 =====

    private String generateMockTranscript(String title) {
        return String.format(
                "[00:00] 안녕하세요, '%s' 회의를 시작하겠습니다.\n" +
                "[00:30] 먼저 지난 주 진행 상황을 공유해 주세요.\n" +
                "[02:15] 프론트엔드 개발이 80%% 완료되었습니다.\n" +
                "[03:00] 백엔드 API는 이번 주 내로 마무리할 예정입니다.\n" +
                "[05:30] QA 테스트 일정을 다음 주로 잡겠습니다.\n" +
                "[07:00] 다음 회의는 수요일에 진행하겠습니다. 수고하셨습니다.", title);
    }

    private String generateMockSummary(String title) {
        return String.format("'%s' 회의에서는 프로젝트 진행 상황을 점검하고 향후 일정을 조율했습니다. " +
                "프론트엔드 개발은 순조롭게 진행 중이며, 백엔드 API 완료 후 QA 테스트를 진행할 예정입니다.", title);
    }

    private String generateMockDiscussions(String title) {
        return "[" +
                "{\"topic\": \"프론트엔드 개발 현황\", \"detail\": \"전체 기능의 80% 구현 완료. UI/UX 개선 사항 논의\"}," +
                "{\"topic\": \"백엔드 API 개발\", \"detail\": \"주요 API 개발 완료. 인증 및 파일 업로드 기능 추가 예정\"}," +
                "{\"topic\": \"QA 테스트 계획\", \"detail\": \"다음 주 월요일부터 QA 테스트 시작 예정\"}" +
                "]";
    }

    private String generateMockDecisions(String title) {
        return "[" +
                "{\"decision\": \"백엔드 API 이번 주 금요일까지 완료\"}," +
                "{\"decision\": \"QA 테스트 다음 주 월요일 시작\"}," +
                "{\"decision\": \"다음 회의는 수요일 오후 2시 진행\"}" +
                "]";
    }

    private void createMockTodos(Meeting meeting) {
        User creator = meeting.getCreatedBy();

        Todo todo1 = Todo.builder()
                .content("백엔드 API 개발 완료")
                .assignee(creator)
                .meeting(meeting)
                .dueDate(LocalDate.now().plusDays(5))
                .completed(false)
                .build();

        Todo todo2 = Todo.builder()
                .content("QA 테스트 케이스 작성")
                .assignee(creator)
                .meeting(meeting)
                .dueDate(LocalDate.now().plusDays(7))
                .completed(false)
                .build();

        Todo todo3 = Todo.builder()
                .content("프론트엔드 UI/UX 개선")
                .assignee(creator)
                .meeting(meeting)
                .dueDate(LocalDate.now().plusDays(3))
                .completed(false)
                .build();

        todoRepository.save(todo1);
        todoRepository.save(todo2);
        todoRepository.save(todo3);
    }
}
