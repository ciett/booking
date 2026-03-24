package com.example.demo.service;

import com.example.demo.entity.Hotel;
import com.example.demo.entity.Room;
import com.example.demo.repository.HotelRepository;
import com.example.demo.repository.RoomRepository;
import com.example.demo.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.time.LocalDate;
import java.util.stream.Collectors;

@Service
public class HotelService {

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    public List<Hotel> getAllHotels() {
        return hotelRepository.findAll();
    }

    public List<Hotel> searchHotels(String city, LocalDate checkIn, LocalDate checkOut) {
        List<Hotel> hotels;
        if (checkIn != null && checkOut != null) {
            hotels = hotelRepository.findAvailableHotels(city, checkIn, checkOut);
        } else {
            hotels = hotelRepository.findByCityContainingIgnoreCase(city);
        }

        return hotels.stream().map(hotel -> {
            // Lấy giá thấp nhất của các phòng trong khách sạn
            List<Room> rooms = roomRepository.findByHotelId(hotel.getId());
            BigDecimal minPrice = rooms.stream()
                    .map(Room::getPricePerNight)
                    .min(BigDecimal::compareTo)
                    .orElse(BigDecimal.ZERO);
            hotel.setPrice(minPrice.intValue());

            // Đếm số lượng review
            long count = reviewRepository.countByHotelId(hotel.getId());
            hotel.setReviewCount(count);

            return hotel;
        }).collect(Collectors.toList());
    }

    public Optional<Hotel> getHotelById(Long id) {
        return hotelRepository.findById(id);
    }

    public Hotel saveHotel(Hotel hotel) {
        return hotelRepository.save(hotel);
    }

    public void deleteHotel(Long id) {
        hotelRepository.deleteById(id);
    }

    public List<String> getDistinctCities() {
        return hotelRepository.findDistinctCities();
    }
}
