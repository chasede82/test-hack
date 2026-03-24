package com.meetsync.service;

import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Slf4j
@Service
public class AiService {

    @Value("${ai.openai.api-key:}")
    private String openaiApiKey;

    @Value("${ai.openai.whisper-url:}")
    private String whisperUrl;

    @Value("${ai.anthropic.api-key:}")
    private String anthropicApiKey;

    @Value("${ai.anthropic.model:}")
    private String anthropicModel;

    @Value("${ai.anthropic.api-url:}")
    private String anthropicApiUrl;

    @Value("${ai.local.venv-path:/Users/ikhyun/git/test-hack/backend/.venv}")
    private String venvPath;

    @Value("${ai.local.scripts-path:/Users/ikhyun/git/test-hack/backend/scripts}")
    private String scriptsPath;

    @Value("${ai.local.ollama-model:gemma3:4b}")
    private String ollamaModel;

    @Value("${ai.local.ollama-url:http://localhost:11434}")
    private String ollamaUrl;

    private final OkHttpClient client = new OkHttpClient.Builder()
            .connectTimeout(60, TimeUnit.SECONDS)
            .readTimeout(600, TimeUnit.SECONDS)
            .writeTimeout(120, TimeUnit.SECONDS)
            .build();

    /**
     * 로컬 Whisper를 사용한 음성 → 텍스트 변환
     */
    public String transcribe(File audioFile) throws IOException {
        log.info("로컬 Whisper STT 변환 시작 - file: {}", audioFile.getName());

        String pythonPath = venvPath + "/bin/python3";
        String scriptPath = scriptsPath + "/transcribe.py";

        ProcessBuilder pb = new ProcessBuilder(
                pythonPath, scriptPath, audioFile.getAbsolutePath()
        );
        pb.redirectErrorStream(false);

        Process process = pb.start();

        String transcript;
        String errorOutput;
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(process.getInputStream(), StandardCharsets.UTF_8));
             BufferedReader errorReader = new BufferedReader(
                new InputStreamReader(process.getErrorStream(), StandardCharsets.UTF_8))) {

            transcript = reader.lines().collect(Collectors.joining("\n")).trim();
            errorOutput = errorReader.lines().collect(Collectors.joining("\n"));
        }

        try {
            int exitCode = process.waitFor();
            if (exitCode != 0) {
                log.error("Whisper 프로세스 실패 - exitCode: {}, error: {}", exitCode, errorOutput);
                throw new IOException("Whisper STT 실패: " + errorOutput);
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IOException("Whisper 프로세스 중단됨", e);
        }

        log.info("로컬 Whisper STT 변환 완료 - 길이: {} chars", transcript.length());
        return transcript;
    }

    /**
     * Ollama를 사용한 회의록 + TODO 생성
     */
    public String generateMinutes(String transcript, String meetingTitle) throws IOException {
        log.info("Ollama 회의록 생성 시작 - title: {}, model: {}", meetingTitle, ollamaModel);

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
                    {"content": "할 일 내용", "assignee": "담당자 이름 (알 수 없으면 '미정')", "dueDate": null}
                  ]
                }

                주의사항:
                - 반드시 유효한 JSON만 응답하세요. 마크다운 코드블록 없이 순수 JSON만 출력하세요.
                - discussions는 최소 1개, 최대 10개
                - decisions는 최소 1개
                - todos는 회의에서 언급된 액션 아이템을 모두 추출하세요
                - 한국어로 작성하세요
                """, meetingTitle, transcript);

        JSONObject requestBody = new JSONObject();
        requestBody.put("model", ollamaModel);
        requestBody.put("prompt", prompt);
        requestBody.put("stream", false);
        requestBody.put("format", "json");

        RequestBody body = RequestBody.create(
                requestBody.toString(),
                MediaType.parse("application/json")
        );

        Request request = new Request.Builder()
                .url(ollamaUrl + "/api/generate")
                .post(body)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                String errorBody = response.body() != null ? response.body().string() : "Unknown error";
                log.error("Ollama API 오류: {} - {}", response.code(), errorBody);
                throw new IOException("Ollama API 호출 실패: " + response.code());
            }

            String responseBody = response.body().string();
            JSONObject jsonResponse = new JSONObject(responseBody);
            String text = jsonResponse.getString("response").trim();

            // Clean up potential markdown code blocks
            if (text.startsWith("```json")) {
                text = text.substring(7);
            } else if (text.startsWith("```")) {
                text = text.substring(3);
            }
            if (text.endsWith("```")) {
                text = text.substring(0, text.length() - 3);
            }
            text = text.trim();

            log.info("Ollama 회의록 생성 완료");
            return text;
        }
    }
}
