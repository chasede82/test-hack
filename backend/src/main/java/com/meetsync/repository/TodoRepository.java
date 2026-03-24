package com.meetsync.repository;

import com.meetsync.domain.Todo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {

    List<Todo> findByAssigneeId(Long assigneeId);

    List<Todo> findByMeetingId(Long meetingId);

    List<Todo> findByAssigneeIdAndCompleted(Long assigneeId, boolean completed);
}
