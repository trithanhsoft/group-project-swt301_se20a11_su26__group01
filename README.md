Restaurant Management System (RMS)

1. Project Overview

This project is a comprehensive restaurant management platform that allows customers to order food online, reserve tables, make online payments, and review restaurant services. The system helps restaurant staff manage tables, process customer orders, generate invoices, and support customers in real time. Kitchen staff can monitor cooking orders and update food preparation status. Administrators can manage menus, employees, coupons, revenue statistics, and customer feedback.

The system is designed to improve restaurant operation efficiency, enhance customer experience, and support digital transformation in restaurant management.

2. Research By Learning (RBL) Focus
Algorithms
Food Recommendation Algorithm

Research and implement recommendation algorithms that suggest suitable foods based on customer preferences, order history, and popular menu items.

Table Reservation Optimization

Research reservation scheduling logic to optimize table allocation based on customer quantity, reservation time, and table availability.

Cooking Time Prediction

Research prediction logic to estimate food preparation time based on food type and current kitchen workload.

3. System Architecture
Role-Based Access Control (RBAC)

Design and implement a multi-role access control system including:

Admin
Staff
Kitchen Staff
Customer

Each role has separate permissions and functionalities to ensure system security and proper workflow management.

Real-time Order Tracking

Implement a real-time order tracking mechanism that allows customers and staff to monitor order progress instantly.

Automated Notification System

Build an automatic notification system (Email or In-App Notification) to notify users when:

Orders are successfully placed

Reservations are confirmed

Orders are completed

Payments are confirmed

4. Technologies
   
Backend

Java 21

Spring Boot

Spring Security + JWT

Spring Data JPA / Hibernate

Maven

Frontend

ReactJS

Bootstrap 5

Axios

Database

MySQL

AI Integration

OpenAI API / Gemini API

Other Tools & Technologies

Swagger UI

Cloudinary (Image Upload)

GitHub

Postman

Figma

6. Installation & Setup Guide

Prerequisites

Before running the project, make sure the following software is installed:

Java 21

Node.js

MySQL 8+

Maven 3.9+

Git

Optional:

Cloudinary Account (for image upload feature)

6. Setup Steps

Step 1: Clone Repository

git clone https://github.com/your-repo/restaurant-management-system.git

Step 2: Database Setup

Create a MySQL database:

CREATE DATABASE restaurant_management_db;
Step 3: Configure Environment

Open:

src/main/resources/application.properties

Configure database connection:

spring.datasource.url=jdbc:mysql://localhost:3306/restaurant_management_db
spring.datasource.username=root
spring.datasource.password=your_password

Configure email service:

spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your_email@gmail.com
spring.mail.password=your_app_password

Step 4: Run Backend Application

Open terminal in backend project folder:

mvn clean install
mvn spring-boot:run

Backend server will run at:

http://localhost:8080

Step 5: Run Frontend Application

Open terminal in frontend project folder:

npm install
npm run dev

Frontend application will run at:

http://localhost:5173

7. API Documentation

After successfully running the application, API documentation can be accessed via Swagger UI:

http://localhost:8080/swagger-ui.html

Swagger provides detailed information about:

Authentication APIs
Food APIs
Order APIs
Reservation APIs
Payment APIs
Customer APIs
8. Main Folder Structure
src/main/java/com/restaurant/

├── config/          # Security, JWT, Swagger Configuration

├── controller/      # REST API Controllers

├── dto/             # Data Transfer Objects

├── model/           # Database Entities

├── repository/      # JPA Repository Layer

├── service/         # Business Logic Layer

├── util/            # Utility Classes

└── exception/       # Exception Handling

9. Main Functionalities
    
Customer Functions

View Menu

Search Food

Filter Food By Category

View Food Detail

Add Food To Cart

Place Order

Reserve Table

Make Online Payment

Review Food

Chat With AI Chatbot

Staff Functions

Manage Tables

Create Orders

Update Order Status

Confirm Payments

Print Invoices

Handle Customer Requests

Kitchen Staff Functions

View Cooking Orders

Update Food Status

Accept Cooking Orders

Predict Cooking Time

Admin Functions

Manage Employees

Manage Food Menu

Manage Coupons

View Revenue Statistics

View Dashboard Reports

View Customer Feedback

11. Contributors

Member	Student ID	Responsibilities

Nguyễn Đức Thương	DE190096	Backend Development, Database Design, Authentication APIs

Phạm Văn Quyết	DE190425	Frontend Development, UI/UX Design

Phan Nguyễn	DE191019	Payment Integration, Customer APIs

13. Database Setup

Create MySQL Database:

CREATE DATABASE restaurant_management_db;

Database Name:

restaurant_management_db

