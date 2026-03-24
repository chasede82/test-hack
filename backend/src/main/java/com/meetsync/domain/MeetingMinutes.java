package com.meetsync.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * 회의록 엔티티 - AI가 생성한 회의 요약, 논의 사항, 결정 사항
 */
@Entity
@Table(name = "meeting_minutes")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MeetingMinutes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "meeting_id", nullable = false, unique = true)
    private Meeting meeting;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(columnDefinition = "TEXT")
    private String discussions; // JSON 형태로 저장

    @Column(columnDefinition = "TEXT")
    private String decisions; // JSON 형태로 저장

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
