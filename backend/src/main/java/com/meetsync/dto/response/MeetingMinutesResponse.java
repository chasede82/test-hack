package com.meetsync.dto.response;

import com.meetsync.domain.MeetingMinutes;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MeetingMinutesResponse {

    private Long id;
    private Long meetingId;
    private String summary;
    private String discussions;
    private String decisions;
    private String transcript;
    private List<TodoResponse> todos;

    public static MeetingMinutesResponse from(MeetingMinutes minutes, List<TodoResponse> todos) {
        return MeetingMinutesResponse.builder()
                .id(minutes.getId())
                .meetingId(minutes.getMeeting().getId())
                .summary(minutes.getSummary())
                .discussions(minutes.getDiscussions())
                .decisions(minutes.getDecisions())
                .transcript(minutes.getMeeting().getTranscript())
                .todos(todos)
                .build();
    }
}
