package com.meetsync.domain;

/**
 * 회의 처리 상태
 */
public enum MeetingStatus {
    UPLOADING,    // 녹음 파일 업로드 중
    PROCESSING,   // AI 처리 중 (STT + 요약)
    COMPLETED,    // 처리 완료
    FAILED        // 처리 실패
}
