package com.meetsync.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateTodoRequest {

    @NotBlank(message = "할일 내용은 필수입니다")
    private String content;

    @NotNull(message = "담당자 ID는 필수입니다")
    private Long assigneeId;

    private Long meetingId;

    private LocalDate dueDate;
}
