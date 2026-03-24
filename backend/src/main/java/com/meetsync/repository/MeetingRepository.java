package com.meetsync.repository;

import com.meetsync.domain.Meeting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MeetingRepository extends JpaRepository<Meeting, Long> {

    List<Meeting> findByChannelId(Long channelId);

    List<Meeting> findByCreatedById(Long userId);
}
