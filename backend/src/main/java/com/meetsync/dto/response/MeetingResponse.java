package com.meetsync.dto.response;

import com.meetsync.domain.Meeting;
import com.meetsync.domain.MeetingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MeetingResponse {

    private Long id;
    private String title;
    private MeetingStatus status;
    private Long channelId;
    private String createdByName;
    private LocalDateTime createdAt;

    public static MeetingResponse from(Meeting meeting) {
        return MeetingResponse.builder()
                .id(meeting.getId())
                .title(meeting.getTitle())
                .status(meeting.getStatus())
                .channelId(meeting.getChannel().getId())
                .createdByName(meeting.getCreatedBy().getName())
                .createdAt(meeting.getCreatedAt())
                .build();
    }
}
