package com.meetsync.service;

import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
public class AiService {

    @Value("${ai.openai.api-key}")
    private String openaiApiKey;

    @Value("${ai.openai.whisper-url}")
    private String whisperUrl;

    @Value("${ai.anthropic.api-key}")
    private String anthropicApiKey;

    @Value("${ai.anthropic.model}")
    private String anthropicModel;

    @Value("${ai.anthropic.api-url}")
    private String anthropicApiUrl;

    private final OkHttpClient client = new OkHttpClient.Builder()
            .connectTimeout(60, TimeUnit.SECONDS)
            .readTimeout(300, TimeUnit.SECONDS)
            .writeTimeout(120, TimeUnit.SECONDS)
            .build();

    /**
     * OpenAI Whisper API를 사용한 음성 → 텍스트 변환
     */
    public String transcribe(File audioFile) throws IOException {
        log.info("STT 변환 시작 - file: {}", audioFile.getName());

        RequestBody fileBody = RequestBody.create(audioFile, MediaType.parse("audio/mpeg"));

        MultipartBody requestBody = new MultipartBody.Builder()
                .setType(MultipartBody.FORM)
                .addFormDataPart("file", audioFile.getName(), fileBody)
                .addFormDataPart("model", "whisper-1")
                .addFormDataPart("language", "ko")
                .addFormDataPart("response_format", "text")
                .build();

        Request request = new Request.Builder()
                .url(whisperUrl)
                .header("Authorization", "Bearer " + openaiApiKey)
                .post(requestBody)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                String errorBody = response.body() != null ? response.body().string() : "Unknown error";
                log.error("Whisper API 오류: {} - {}", response.code(), errorBody);
                throw new IOException("Whisper API 호출 실패: " + response.code());
            }
            String transcript = response.body().string();
            log.info("STT 변환 완료 - 길이: {} chars", transcript.length());
            return transcript;
        }
    }

    /**
     * Claude API를 사용한 회의록 + TODO 생성
     * Returns JSON string with structure: { summary, discussions, decisions, todos }
     */
    public String generateMinutes(String transcript, String meetingTitle) throws IOException {
        log.info("회의록 생성 시작 - title: {}", meetingTitle);

        String prompt = String.format("""
                당신은 회의록 작성 전문가입니다. 아래 회의 녹취록을 분석하여 JSON 형식으로 회의록을 작성해주세요.

                회의 제목: %s

                녹취록:
                %s

                다음 JSON 형식으로 정확히 응답해주세요 (다른 텍스트 없이 JSON만):
                {
                  "summary": "회의 전체 요약 (3-5문장)",
                  "discussions": [
                    {"topic": "논의 주제", "detail": "상세 내용"}
                  ],
                  "decisions": [
                    {"decision": "결정 사항"}
                  ],
                  "todos": [
                    {"content": "할 일 내용", "assignee": "담당자 이름 (알 수 없으면 '미정')", "dueDate": "마감일 (알 수 없으면 null)"}
                  ]
                }

                주의사항:
                - 반드시 유효한 JSON만 응답하세요
                - discussions는 최소 1개, 최대 10개
                - decisions는 최소 1개
                - todos는 회의에서 언급된 액션 아이템을 모두 추출하세요
                - 한국어로 작성하세요
                """, meetingTitle, transcript);

        JSONObject messageBody = new JSONObject();
        messageBody.put("model", anthropicModel);
        messageBody.put("max_tokens", 4096);

        JSONArray messages = new JSONArray();
        JSONObject userMsg = new JSONObject();
        userMsg.put("role", "user");
        userMsg.put("content", prompt);
        messages.put(userMsg);
        messageBody.put("messages", messages);

        RequestBody body = RequestBody.create(
                messageBody.toString(),
                MediaType.parse("application/json")
        );

        Request request = new Request.Builder()
                .url(anthropicApiUrl)
                .header("x-api-key", anthropicApiKey)
                .header("anthropic-version", "2023-06-01")
                .header("content-type", "application/json")
                .post(body)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                String errorBody = response.body() != null ? response.body().string() : "Unknown error";
                log.error("Claude API 오류: {} - {}", response.code(), errorBody);
                throw new IOException("Claude API 호출 실패: " + response.code());
            }

            String responseBody = response.body().string();
            JSONObject jsonResponse = new JSONObject(responseBody);
            JSONArray content = jsonResponse.getJSONArray("content");
            String text = content.getJSONObject(0).getString("text");

            // Extract JSON from response (handle potential markdown code blocks)
            text = text.trim();
            if (text.startsWith("```json")) {
                text = text.substring(7);
            } else if (text.startsWith("```")) {
                text = text.substring(3);
            }
            if (text.endsWith("```")) {
                text = text.substring(0, text.length() - 3);
            }
            text = text.trim();

            log.info("회의록 생성 완료");
            return text;
        }
    }
}
