package com.meetsync.service;

import com.meetsync.domain.Meeting;
import com.meetsync.domain.Todo;
import com.meetsync.domain.User;
import com.meetsync.dto.request.CreateTodoRequest;
import com.meetsync.dto.request.UpdateTodoRequest;
import com.meetsync.dto.response.TodoResponse;
import com.meetsync.exception.ResourceNotFoundException;
import com.meetsync.repository.TodoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 할일 서비스 - CRUD 및 상태 관리
 */
@Service
@RequiredArgsConstructor
public class TodoService {

    private final TodoRepository todoRepository;
    private final UserService userService;
    private final MeetingService meetingService;

    /**
     * 할일 생성
     */
    @Transactional
    public TodoResponse create(CreateTodoRequest request) {
        User assignee = userService.findById(request.getAssigneeId());

        Meeting meeting = null;
        if (request.getMeetingId() != null) {
            meeting = meetingService.findMeetingById(request.getMeetingId());
        }

        Todo todo = Todo.builder()
                .content(request.getContent())
                .assignee(assignee)
                .meeting(meeting)
                .dueDate(request.getDueDate())
                .completed(false)
                .build();

        todo = todoRepository.save(todo);
        return TodoResponse.from(todo);
    }

    /**
     * 사용자별 할일 목록 조회
     */
    @Transactional(readOnly = true)
    public List<TodoResponse> getByUser(String userEmail) {
        User user = userService.findByEmail(userEmail);
        return todoRepository.findByAssigneeId(user.getId()).stream()
                .map(TodoResponse::from)
                .collect(Collectors.toList());
    }

    /**
     * 회의별 할일 목록 조회
     */
    @Transactional(readOnly = true)
    public List<TodoResponse> getByMeeting(Long meetingId) {
        return todoRepository.findByMeetingId(meetingId).stream()
                .map(TodoResponse::from)
                .collect(Collectors.toList());
    }

    /**
     * 할일 수정 (내용, 마감일, 완료 상태)
     */
    @Transactional
    public TodoResponse update(Long id, UpdateTodoRequest request) {
        Todo todo = findTodoById(id);

        if (request.getContent() != null) {
            todo.setContent(request.getContent());
        }
        if (request.getDueDate() != null) {
            todo.setDueDate(request.getDueDate());
        }
        if (request.getCompleted() != null) {
            todo.setCompleted(request.getCompleted());
        }

        todo = todoRepository.save(todo);
        return TodoResponse.from(todo);
    }

    /**
     * 할일 삭제
     */
    @Transactional
    public void delete(Long id) {
        Todo todo = findTodoById(id);
        todoRepository.delete(todo);
    }

    /**
     * 할일 엔티티 조회 (내부 사용)
     */
    private Todo findTodoById(Long id) {
        return todoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("할일", "id", id));
    }
}
