package com.example.demo.controller;

import com.example.demo.entity.Setting;
import com.example.demo.repository.SettingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/config")
@CrossOrigin(origins = "*")
public class ConfigController {

    @Autowired
    private SettingRepository settingRepository;

    @GetMapping("/images")
    public ResponseEntity<Map<String, String>> getImagesConfig() {
        List<Setting> settings = settingRepository.findAll();
        Map<String, String> imageConfigs = settings.stream()
                .filter(s -> s.getKey().startsWith("img."))
                .collect(Collectors.toMap(Setting::getKey, Setting::getValue));
        return ResponseEntity.ok(imageConfigs);
    }
}
