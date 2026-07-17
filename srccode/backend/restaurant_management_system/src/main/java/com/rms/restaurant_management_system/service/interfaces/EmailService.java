package com.rms.restaurant_management_system.service.interfaces;

public interface EmailService {

    void sendOtpEmail(String toEmail, String otp);
}