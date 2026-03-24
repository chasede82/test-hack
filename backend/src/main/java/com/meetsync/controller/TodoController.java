package com.meetsync.controller;

import com.meetsync.dto.request.CreateTodoRequest;
import com.meetsync.dto.request.UpdateTodoRequest;
import com.meetsync.dto.response.TodoResponse;
import com.meetsync.service.TodoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 할일 컨트롤러 - 할일 CRUD
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class TodoController {

    private final TodoService todoService;

    /**
     * 할일 생성
     */
    @PostMapping("/todos")
    public ResponseEntity<TodoResponse> create(@Valid @RequestBody CreateTodoRequest request) {
        TodoResponse response = todoService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * 내 할일 목록 조회
     */
    @GetMapping("/todos")
    public ResponseEntity<List<TodoResponse>> getMyTodos(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<TodoResponse> responses = todoService.getByUser(userDetails.getUsername());
        return ResponseEntity.ok(responses);
    }

    /**
     * 회의별 할일 목록 조회
     */
    @GetMapping("/meetings/{meetingId}/todos")
    public ResponseEntity<List<TodoResponse>> getByMeeting(@PathVariable Long meetingId) {
        List<TodoResponse> responses = todoService.getByMeeting(meetingId);
        return ResponseEntity.ok(responses);
    }

    /**
     * 할일 수정 (내용, 마감일, 완료 상태)
     */
    @PutMapping("/todos/{id}")
    public ResponseEntity<TodoResponse> update(
            @PathVariable Long id,
            @RequestBody UpdateTodoRequest request) {
        TodoResponse response = todoService.update(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * 할일 삭제
     */
    @DeleteMapping("/todos/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        todoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
