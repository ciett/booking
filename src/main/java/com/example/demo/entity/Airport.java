package com.example.demo.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "airports")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Airport {
    @Id @Column(length = 10)
    private String code;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private String city;
    @Column(length = 100)
    private String country = "Vietnam";
}