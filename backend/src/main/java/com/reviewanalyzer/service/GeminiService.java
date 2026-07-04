package com.reviewanalyzer.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.reviewanalyzer.dto.AnalysisResponse;
import com.reviewanalyzer.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    private static final String PROMPT_TEMPLATE = """
            You are an expert Customer Review Analyst.
            Analyze the customer reviews provided below.
            Return ONLY valid JSON with no markdown, no code fences, and no extra text.
            Use this exact structure:
            {
              "summary": "string",
              "positivePoints": ["string"],
              "negativePoints": ["string"],
              "complaints": ["string"],
              "features": ["string"],
              "keywords": ["string"],
              "suggestions": ["string"],
              "sentiment": {
                "positive": number,
                "neutral": number,
                "negative": number
              }
            }
            Sentiment percentages must total exactly 100.
            Customer reviews:
            %s
            """;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper;

    @Value("${app.gemini.api-key}")
    private String apiKey;

    @Value("${app.gemini.model}")
    private String model;

    public GeminiService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public AnalysisResponse analyzeReviews(String reviewText) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new BadRequestException("Gemini API key is not configured. Set GEMINI_API_KEY environment variable.");
        }

        String prompt = String.format(PROMPT_TEMPLATE, reviewText);
        String url = String.format(
                "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s",
                model,
                apiKey
        );

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(
                                Map.of("text", prompt)
                        ))
                ),
                "generationConfig", Map.of(
                        "temperature", 0.3,
                        "responseMimeType", "application/json"
                )
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                throw new BadRequestException("Failed to analyze reviews with Gemini API");
            }

            JsonNode root = objectMapper.readTree(response.getBody());
            String generatedText = root.path("candidates").path(0).path("content").path("parts").path(0).path("text").asText();

            if (generatedText == null || generatedText.isBlank()) {
                throw new BadRequestException("Empty response from Gemini API");
            }

            String cleaned = generatedText.trim();
            if (cleaned.startsWith("```")) {
                cleaned = cleaned.replaceAll("^```(?:json)?\\s*", "").replaceAll("\\s*```$", "");
            }

            JsonNode analysisJson = objectMapper.readTree(cleaned);
            return mapToAnalysisResponse(analysisJson, reviewText);
        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            throw new BadRequestException("Gemini analysis failed: " + e.getMessage());
        }
    }

    private AnalysisResponse mapToAnalysisResponse(JsonNode node, String reviewText) {
        AnalysisResponse.SentimentDto sentiment = AnalysisResponse.SentimentDto.builder()
                .positive(node.path("sentiment").path("positive").asInt(0))
                .neutral(node.path("sentiment").path("neutral").asInt(0))
                .negative(node.path("sentiment").path("negative").asInt(0))
                .build();

        normalizeSentiment(sentiment);

        int wordCount = countWords(reviewText);
        int charCount = reviewText.length();

        return AnalysisResponse.builder()
                .reviewText(reviewText)
                .wordCount(wordCount)
                .charCount(charCount)
                .summary(node.path("summary").asText(""))
                .positivePoints(readStringArray(node.path("positivePoints")))
                .negativePoints(readStringArray(node.path("negativePoints")))
                .complaints(readStringArray(node.path("complaints")))
                .features(readStringArray(node.path("features")))
                .keywords(readStringArray(node.path("keywords")))
                .suggestions(readStringArray(node.path("suggestions")))
                .sentiment(sentiment)
                .build();
    }

    private void normalizeSentiment(AnalysisResponse.SentimentDto sentiment) {
        int total = sentiment.getPositive() + sentiment.getNeutral() + sentiment.getNegative();
        if (total == 100) {
            return;
        }
        if (total == 0) {
            sentiment.setPositive(34);
            sentiment.setNeutral(33);
            sentiment.setNegative(33);
            return;
        }
        sentiment.setPositive(Math.round(sentiment.getPositive() * 100f / total));
        sentiment.setNeutral(Math.round(sentiment.getNeutral() * 100f / total));
        sentiment.setNegative(100 - sentiment.getPositive() - sentiment.getNeutral());
    }

    private List<String> readStringArray(JsonNode node) {
        List<String> values = new ArrayList<>();
        if (node != null && node.isArray()) {
            Iterator<JsonNode> it = node.elements();
            while (it.hasNext()) {
                values.add(it.next().asText());
            }
        }
        return values;
    }

    private int countWords(String text) {
        if (text == null || text.isBlank()) {
            return 0;
        }
        return text.trim().split("\\s+").length;
    }
}
