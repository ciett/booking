package com.example.demo.controller;

import com.example.demo.service.SystemDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/system")
@CrossOrigin(origins = "*")
public class SystemDataController {

    @Autowired
    private SystemDataService systemDataService;

    @PostMapping("/shift-data")
    public ResponseEntity<?> shiftData(@RequestParam(defaultValue = "1") int days) {
        try {
            int count = systemDataService.shiftDemoDates(days);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Đã tịnh tiến " + count + " bản ghi lên " + days + " ngày.",
                    "days", days
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}
