package com.rms.restaurant_management_system.service.impl;

import com.rms.restaurant_management_system.service.interfaces.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Override
    public void sendOtpEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("CGKC - Mã OTP đặt lại mật khẩu");

        message.setText(
                "Xin chào,\n\n" +
                "Mã OTP đặt lại mật khẩu của bạn là: " + otp + "\n\n" +
                "Mã này có hiệu lực trong 5 phút.\n\n" +
                "Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.\n\n" +
                "Cái Gì Cũng Không Có"
        );

        mailSender.send(message);
    }
}
