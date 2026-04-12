package com.example.demo.controller;

import com.example.demo.dto.ChatRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class OllamaController {

    private final String OLLAMA_API_URL = "http://localhost:11434/api/generate";
    // Tên model được khai báo tương thích. Nếu dev sử dụng bản 2b, có thể đổi thành gemma:2b.
    private final String MODEL_NAME = "gemma"; 

    @PostMapping("/ask")
    public ResponseEntity<Map<String, String>> askChatbot(@RequestBody ChatRequest request) {
        try {
            RestTemplate restTemplate = new RestTemplate();

            // 1. Dựng Prompt Context cho AI
            String systemPrompt = "Bạn là trợ lý AI ảo tư vấn dịch vụ du lịch, đặt vé máy bay và khách sạn của hệ thống Booking tên là Gemma. " +
                                  "Hãy đóng vai chuyên gia thân thiện, trả lời câu hỏi bằng tiếng Việt ngắn gọn, chuyên nghiệp và lịch sự. " +
                                  "Người dùng đang hỏi: " + request.getMessage();

            // 2. Tạo Payload gửi cho Ollama
            Map<String, Object> ollamaPayload = new HashMap<>();
            ollamaPayload.put("model", MODEL_NAME);
            ollamaPayload.put("prompt", systemPrompt);
            ollamaPayload.put("stream", false);

            // 3. Gọi API của Ollama
            Map<String, Object> ollamaResponse = restTemplate.postForObject(OLLAMA_API_URL, ollamaPayload, Map.class);
            
            String reply = "";
            if (ollamaResponse != null && ollamaResponse.containsKey("response")) {
                reply = ollamaResponse.get("response").toString();
            } else {
                reply = "Gemma đang bận, vui lòng thử lại sau nhé!";
            }

            // 4. Trả kết quả về Frontend
            Map<String, String> result = new HashMap<>();
            result.put("response", reply);

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> errMap = new HashMap<>();
            errMap.put("response", "Xin lỗi, Hệ thống AI đang bảo trì hoặc chưa bật Ollama trên máy tính!");
            return ResponseEntity.status(500).body(errMap);
        }
    }
}
