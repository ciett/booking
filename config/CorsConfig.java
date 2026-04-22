import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Áp dụng cho mọi API endpoint
                .allowedOrigins("https://booking-beige-xi.vercel.app/") // ĐIỀN LINK VERCEL CỦA BẠN VÀO ĐÂY
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Cho phép các phương thức này
                .allowedHeaders("*") // Cho phép mọi header
                .allowCredentials(true); // Cho phép gửi cookie/token nếu có
    }
}