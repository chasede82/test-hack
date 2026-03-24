package com.meetsync.dto.response;

import com.meetsync.domain.Todo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TodoResponse {

    private Long id;
    private String content;
    private String assigneeName;
    private String meetingTitle;
    private LocalDate dueDate;
    private boolean completed;

    public static TodoResponse from(Todo todo) {
        return TodoResponse.builder()
                .id(todo.getId())
                .content(todo.getContent())
                .assigneeName(todo.getAssignee().getName())
                .meetingTitle(todo.getMeeting() != null ? todo.getMeeting().getTitle() : null)
                .dueDate(todo.getDueDate())
                .completed(todo.isCompleted())
                .build();
    }
}
