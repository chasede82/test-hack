package com.meetsync.repository;

import com.meetsync.domain.Channel;
import com.meetsync.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChannelRepository extends JpaRepository<Channel, Long> {

    List<Channel> findByMembersContaining(User user);
}
