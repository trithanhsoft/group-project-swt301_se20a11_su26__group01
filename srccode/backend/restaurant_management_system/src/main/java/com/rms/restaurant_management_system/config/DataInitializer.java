package com.rms.restaurant_management_system.config;

import com.rms.restaurant_management_system.entity.Category;
import com.rms.restaurant_management_system.entity.Food;
import com.rms.restaurant_management_system.entity.Role;
import com.rms.restaurant_management_system.entity.User;
import com.rms.restaurant_management_system.repository.CategoryRepository;
import com.rms.restaurant_management_system.repository.FoodRepository;
import com.rms.restaurant_management_system.repository.RoleRepository;
import com.rms.restaurant_management_system.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CategoryRepository categoryRepository;
    private final FoodRepository foodRepository;

    @Override
    public void run(String... args) {
        // ── Roles ──────────────────────────────────────────
        createRoleIfNotExists("ADMIN");
        createRoleIfNotExists("CUSTOMER");
        createRoleIfNotExists("STAFF");
        createRoleIfNotExists("KITCHEN");

        // ── Users ──────────────────────────────────────────
        createUserIfNotExists("admin",    "admin@gmail.com",    "123456", "ADMIN");
        createUserIfNotExists("staff",    "staff@gmail.com",    "123456", "STAFF");
        createUserIfNotExists("kitchen",  "kitchen@gmail.com",  "123456", "KITCHEN");
        createUserIfNotExists("customer", "customer@gmail.com", "123456", "CUSTOMER");

        // ── Categories ─────────────────────────────────────
        createCategoryIfNotExists("Khai vị",     "Các món khai vị");
        createCategoryIfNotExists("Món chính",   "Các món chính");
        createCategoryIfNotExists("Tráng miệng", "Các món tráng miệng");
        createCategoryIfNotExists("Đồ uống",     "Các loại đồ uống");
        createCategoryIfNotExists("Súp & Cháo",  "Các món súp và cháo");

        // ── Foods ──────────────────────────────────────────
        // Khai vị
        createFoodIfNotExists(
            "Súp bào ngư vi cá",
            "Súp bào ngư vi cá thượng hạng",
            185000,
            "https://images.unsplash.com/photo-1547592180-85f173990554?w=400",
            "🍲", "Khai vị");

        createFoodIfNotExists(
            "Gỏi tôm hùm xoài xanh",
            "Gỏi tôm hùm tươi với xoài xanh chua ngọt",
            220000,
            "https://images.unsplash.com/photo-1559847844-5315695dadae?w=400",
            "🥗", "Khai vị");

        createFoodIfNotExists(
            "Chả giò hải sản",
            "Chả giò giòn nhân hải sản",
            120000,
            "https://images.unsplash.com/photo-1562802378-063ec186a863?w=400",
            "�", "Khai vị");

        // Món chính
        createFoodIfNotExists(
            "Bò Wagyu nướng than hoa",
            "Bò Wagyu A5 nướng than hoa thơm lừng",
            580000,
            "https://images.unsplash.com/photo-1558030006-450675393462?w=400",
            "🥩", "Món chính");

        createFoodIfNotExists(
            "Tôm hùm hấp bia",
            "Tôm hùm tươi hấp bia đặc trưng",
            750000,
            "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400",
            "🦞", "Món chính");

        createFoodIfNotExists(
            "Cá hồi áp chảo sốt chanh",
            "Cá hồi Na Uy áp chảo sốt chanh thơm ngon",
            320000,
            "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400",
            "🐟", "Món chính");

        createFoodIfNotExists(
            "Vịt quay Bắc Kinh",
            "Vịt quay Bắc Kinh da giòn vàng đậm",
            420000,
            "https://images.unsplash.com/photo-1611599537845-1c7aca0091c0?w=400",
            "🦆", "Món chính");

        createFoodIfNotExists(
            "Sườn bò hầm rượu vang",
            "Sườn bò hầm rượu vang đỏ Pháp mềm tan",
            380000,
            "https://images.unsplash.com/photo-1544025162-d76594e1c2de?w=400",
            "🍖", "Món chính");

        createFoodIfNotExists(
            "Khoai tây nghiền truffle",
            "Khoai tây nghiền bơ với nấm truffle đen",
            95000,
            "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400",
            "🥔", "Món chính");

        createFoodIfNotExists(
            "Rau củ nướng thảo mộc",
            "Rau củ nướng lò với các loại thảo mộc tươi",
            85000,
            "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400",
            "�", "Món chính");

        // Tráng miệng
        createFoodIfNotExists(
            "Bánh soufflé socola",
            "Bánh soufflé socola nóng chảy trong",
            125000,
            "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400",
            "🍫", "Tráng miệng");

        createFoodIfNotExists(
            "Crème brûlée vani",
            "Kem crème brûlée vani Madagascar",
            95000,
            "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400",
            "�", "Tráng miệng");

        createFoodIfNotExists(
            "Bánh tart chanh leo",
            "Bánh tart chanh leo chua ngọt thanh mát",
            85000,
            "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=400",
            "�", "Tráng miệng");

        // Đồ uống
        createFoodIfNotExists(
            "Cocktail Signature",
            "Cocktail đặc trưng của nhà hàng",
            145000,
            "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400",
            "🍹", "Đồ uống");

        createFoodIfNotExists(
            "Rượu vang đỏ Pháp",
            "Ly rượu vang đỏ Bordeaux thượng hạng",
            280000,
            "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400",
            "�", "Đồ uống");

        createFoodIfNotExists(
            "Nước ép trái cây tươi",
            "Nước ép trái cây tươi theo mùa",
            65000,
            "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400",
            "🥤", "Đồ uống");

        createFoodIfNotExists(
            "Trà thảo mộc hữu cơ",
            "Trà thảo mộc organic imported",
            55000,
            "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400",
            "�", "Đồ uống");

        // Súp & Cháo
        createFoodIfNotExists(
            "Súp kem nấm rừng",
            "Súp kem nấm rừng tươi thơm ngon",
            110000,
            "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400",
            "�", "Súp & Cháo");
    }

    // ── Helpers ────────────────────────────────────────────────────────────────

    private void createRoleIfNotExists(String roleName) {
        if (roleRepository.findByRoleName(roleName).isEmpty()) {
            roleRepository.save(Role.builder()
                    .roleName(roleName)
                    .isActive(true)
                    .build());
        }
    }

    private void createUserIfNotExists(String username, String email,
                                        String password, String roleName) {
        if (userRepository.existsByEmail(email)) return;

        Role role = roleRepository.findByRoleName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));

        userRepository.save(User.builder()
                .username(username)
                .email(email)
                .passwordHash(passwordEncoder.encode(password))
                .role(role)
                .isActive(true)
                .build());
    }

    private Category createCategoryIfNotExists(String name, String description) {
        return categoryRepository.findByCategoryName(name).orElseGet(() ->
                categoryRepository.save(Category.builder()
                        .categoryName(name)
                        .description(description)
                        .isActive(true)
                        .build())
        );
    }

    private void createFoodIfNotExists(String name, String description,
                                        int price, String imageUrl,
                                        String emoji, String categoryName) {
        if (foodRepository.existsByFoodName(name)) return;

        Category category = categoryRepository.findByCategoryName(categoryName)
                .orElseThrow(() -> new RuntimeException("Category not found: " + categoryName));

        foodRepository.save(Food.builder()
                .foodName(name)
                .description(description)
                .price(BigDecimal.valueOf(price))
                .imageUrl(imageUrl)
                .emoji(emoji)
                .rating(4.5)
                .orders(0)
                .isAvailable(true)
                .category(category)
                .build());
    }
}
