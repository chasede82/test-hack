package com.meetsync.dto.response;

import com.meetsync.domain.Channel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChannelResponse {

    private Long id;
    private String name;
    private String description;
    private int memberCount;

    public static ChannelResponse from(Channel channel) {
        return ChannelResponse.builder()
                .id(channel.getId())
                .name(channel.getName())
                .description(channel.getDescription())
                .memberCount(channel.getMembers().size())
                .build();
    }
}
