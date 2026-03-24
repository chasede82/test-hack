package com.meetsync.repository;

import com.meetsync.domain.MeetingMinutes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MeetingMinutesRepository extends JpaRepository<MeetingMinutes, Long> {

    Optional<MeetingMinutes> findByMeetingId(Long meetingId);
}
