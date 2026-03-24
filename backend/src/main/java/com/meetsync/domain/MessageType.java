package com.meetsync.domain;

/**
 * 메시지 유형
 */
public enum MessageType {
    TEXT,              // 일반 텍스트 메시지
    MEETING_MINUTES,   // 회의록 공유 메시지
    SYSTEM             // 시스템 메시지 (입장/퇴장 등)
}
