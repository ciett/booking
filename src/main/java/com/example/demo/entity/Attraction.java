package com.example.demo.entity;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "attractions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Attraction {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private String city;
    @Column(length = 50)
    private String category;
    @Column(nullable = false)
    private BigDecimal price;
}