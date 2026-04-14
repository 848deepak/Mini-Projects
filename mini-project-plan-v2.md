# 🗂️ Mini Projects Repository Plan — UPDATED WITH PDF TECH STACKS
**Chandigarh University — BE-CSE/IT 3rd Year | Jan–June 2026**
**Subjects: System Design (23CSH-314) · Full Stack Dev-II (23CSH-309) · Cloud Computing (23CSH-307)**

> ⚠️ All tech stacks are taken **directly from the PDF** — no substitutions.

---

## 📋 TECH STACK REFERENCE (from PDFs)

### System Design (23CSH-314)
Primary stack: **Java / Spring Boot / MySQL / REST APIs / WebSocket / Redis**
Secondary: Python allowed for select projects

### Full Stack Development-II (23CSH-309)
Primary stack: **React + Redux Toolkit / Spring Boot / JWT / JPA / Docker**
Supporting: WebSockets, Material UI, Axios, Chart.js, Context API, GitHub Actions

### Cloud Computing (23CSH-307)
Primary stack: **AWS (EC2, S3, Lambda, VPC, ECS, RDS, CloudWatch, EventBridge, SNS, SES, DynamoDB, ECR)**
Supporting: Docker, Python (boto3), Apache, nginx

---

## 🗂️ REPOSITORY STRUCTURE

```
mini-projects/
│
├── README.md
├── .gitignore
├── shared/
│   └── pom-template.xml          ← reusable Spring Boot parent POM
│
├── system-design/                ← Java/Spring + MySQL
│   ├── movie-ticket-booking/
│   ├── ride-booking-system/
│   ├── real-time-chat-app/
│   ├── ecommerce-order-management/
│   ├── url-shortener/
│   ├── food-delivery-system/
│   ├── online-banking-system/
│   ├── digital-wallet/
│   ├── hospital-management/
│   ├── smart-parking-system/
│   ├── hotel-booking-system/
│   ├── cab-fleet-management/
│   ├── smart-notification-system/
│   ├── event-booking-system/
│   ├── social-media-feed/
│   ├── file-storage-drive-mini/
│   ├── courier-tracking-system/
│   ├── traffic-monitoring-system/
│   ├── online-auction-system/
│   ├── subscription-billing-system/
│   ├── crm-system/
│   ├── stock-trading-simulator/
│   ├── online-insurance-system/
│   ├── smart-home-automation/
│   └── complaint-management/
│
├── full-stack/                   ← React + Spring Boot + JWT + Docker
│   ├── college-management-portal/
│   ├── online-examination-system/
│   ├── multi-vendor-ecommerce/
│   ├── hospital-appointment-system/
│   ├── employee-attendance-payroll/
│   ├── learning-management-system/
│   ├── digital-expense-tracker/
│   ├── library-management-system/
│   ├── event-registration-platform/
│   ├── complaint-grievance-system/
│   ├── task-project-collaboration/
│   ├── inventory-stock-management/
│   ├── online-food-ordering/
│   ├── student-feedback-rating/
│   ├── job-portal/
│   ├── vehicle-service-booking/
│   ├── online-quiz-platform/
│   ├── real-time-notification/
│   ├── customer-support-ticketing/
│   ├── smart-banking-system/
│   ├── product-review-rating/
│   ├── online-voting-system/
│   ├── hr-recruitment-scheduling/
│   ├── course-certification-platform/
│   ├── travel-booking-itinerary/
│   ├── elearning-doubt-resolution/
│   ├── subscription-content-platform/
│   ├── asset-resource-management/
│   ├── online-doctor-consultation/
│   ├── smart-city-issue-reporting/
│   ├── warehouse-logistics/
│   ├── freelancer-marketplace/
│   ├── secure-file-sharing/
│   ├── restaurant-table-reservation/
│   └── cicd-fullstack-app/
│
├── cloud-computing/              ← AWS services
│   ├── portfolio-on-ec2/
│   ├── photo-gallery-s3/
│   ├── multi-region-backup/
│   ├── ec2-auto-stop-scheduler/
│   ├── vpc-public-private-arch/
│   ├── load-balanced-webapp/
│   ├── containerized-blog/
│   ├── serverless-image-resizer/
│   ├── s3-lifecycle-optimizer/
│   ├── iam-user-management/
│   ├── static-site-cloudfront/
│   ├── ec2-health-dashboard/
│   ├── serverless-contact-form/
│   ├── file-versioning-system/
│   ├── multi-container-app/
│   ├── lambda-calculator-api/
│   ├── s3-event-notifications/
│   ├── ec2-scheduled-backup/
│   ├── secure-file-upload-portal/
│   ├── auto-scaling-webapp/
│   ├── serverless-todo-api/
│   ├── lambda-function-scheduler/
│   ├── multi-az-database/
│   ├── s3-bucket-policy-manager/
│   ├── cross-region-replication/
│   └── containerized-wordpress/
│
└── ai-ml/
    ├── recommendation-system/
    └── sports-analytics-dashboard/
```

---

## 📁 STANDARD FOLDER TEMPLATE

### System Design / Full Stack project:
```
project-name/
├── README.md
├── prompt.md
├── backend/
│   ├── src/main/java/com/project/
│   │   ├── controller/
│   │   ├── service/
│   │   ├── repository/
│   │   ├── model/
│   │   └── config/
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
├── frontend/          ← React (Full Stack) OR N/A (System Design)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/     ← Redux Toolkit
│   │   └── App.jsx
│   └── package.json
└── docker-compose.yml
```

### Cloud Computing project:
```
project-name/
├── README.md
├── prompt.md
├── setup-guide.md     ← step-by-step AWS CLI commands
├── lambda/            ← Python Lambda functions (if applicable)
│   └── function.py
├── config/            ← JSON config files (policies, task definitions)
│   └── *.json
└── demo-ui/           ← optional HTML visualizer
    └── index.html
```

---

# 🚀 SYSTEM DESIGN — AI PROMPTS
> **Tech Stack for ALL System Design projects:**
> Java + Spring Boot + MySQL + REST APIs
> WebSocket added where real-time is needed | Redis added where caching is needed

---

## SD-01: Online Movie Ticket Booking System

```
TECH STACK (from PDF): Java/Spring, MySQL, REST

PROJECT CONTEXT:
Build a Spring Boot REST API for an online movie ticket booking system with
concurrent seat locking. Core challenge: prevent double-booking when multiple
users try to book the same seat simultaneously.

BACKEND STRUCTURE:
movie-ticket-booking/backend/
├── src/main/java/com/moviebooking/
│   ├── controller/
│   │   ├── MovieController.java
│   │   ├── BookingController.java
│   │   └── ShowController.java
│   ├── service/
│   │   ├── MovieService.java
│   │   ├── BookingService.java      ← concurrency handling here
│   │   └── SeatLockService.java     ← 10-min seat hold logic
│   ├── repository/
│   │   ├── MovieRepository.java
│   │   ├── BookingRepository.java
│   │   └── SeatRepository.java
│   ├── model/
│   │   ├── Movie.java
│   │   ├── Show.java
│   │   ├── Seat.java               ← status: AVAILABLE/LOCKED/BOOKED
│   │   └── Booking.java
│   └── config/
│       └── SecurityConfig.java
└── src/main/resources/
    └── application.properties

DATABASE SCHEMA (MySQL):
CREATE TABLE movies (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255), genre VARCHAR(100),
  duration_minutes INT, rating DECIMAL(3,1)
);
CREATE TABLE shows (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  movie_id BIGINT, theater VARCHAR(100),
  show_time DATETIME, total_seats INT,
  FOREIGN KEY (movie_id) REFERENCES movies(id)
);
CREATE TABLE seats (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  show_id BIGINT, row_label CHAR(1),
  seat_number INT, status ENUM('AVAILABLE','LOCKED','BOOKED'),
  locked_by VARCHAR(100), locked_until TIMESTAMP,
  FOREIGN KEY (show_id) REFERENCES shows(id)
);
CREATE TABLE bookings (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id VARCHAR(100), show_id BIGINT,
  seat_ids JSON, total_amount DECIMAL(10,2),
  booking_ref VARCHAR(20) UNIQUE, status VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

KEY REST ENDPOINTS:
GET  /api/movies                    → list movies
GET  /api/shows/{movieId}           → get shows for a movie
GET  /api/shows/{showId}/seats      → get seat map with status
POST /api/seats/lock                → lock seats for 10 minutes (optimistic locking)
POST /api/bookings                  → confirm booking (debit payment)
GET  /api/bookings/{bookingRef}     → get booking details

CONCURRENCY HANDLING (BookingService.java):
Use @Transactional + SELECT ... FOR UPDATE on seat rows OR
use optimistic locking with @Version on Seat entity.
If seat status != AVAILABLE at booking time → throw SeatAlreadyBookedException.
Seat lock expiry: @Scheduled(fixedRate=60000) to release expired locks.

IMPLEMENTATION STEPS:
1. Set up Spring Boot project with dependencies:
   spring-boot-starter-web, spring-boot-starter-data-jpa,
   mysql-connector-java, spring-boot-starter-validation, lombok
2. Configure application.properties:
   spring.datasource.url=jdbc:mysql://localhost:3306/moviedb
   spring.jpa.hibernate.ddl-auto=update
3. Create all entities with @Entity, @Table annotations
4. Seat locking: POST /seats/lock validates availability, sets status=LOCKED,
   locked_by=userId, locked_until=now+10min using @Transactional
5. Booking confirmation: verify all seats still LOCKED by same user,
   set status=BOOKED, generate booking_ref = "BK" + UUID.randomUUID().toString().substring(0,8).toUpperCase()
6. ScheduledTask: @Scheduled bean finds seats WHERE status=LOCKED
   AND locked_until < NOW(), resets to AVAILABLE
7. Global exception handler: @ControllerAdvice returns structured error JSON

TESTING:
Use Postman collection to simulate 2 users booking same seat simultaneously.
```

---

## SD-02: Ride Booking System

```
TECH STACK (from PDF): Java/Python, REST, WebSocket

PROJECT CONTEXT:
Spring Boot application for real-time ride booking with WebSocket-based
driver-user matching and location updates.

BACKEND STRUCTURE:
ride-booking/backend/
├── src/main/java/com/ridebooking/
│   ├── controller/
│   │   ├── RideController.java
│   │   └── WebSocketController.java   ← STOMP messaging
│   ├── service/
│   │   ├── RideService.java
│   │   ├── DriverMatchingService.java  ← find nearest driver
│   │   └── LocationService.java
│   ├── model/
│   │   ├── Ride.java
│   │   ├── Driver.java               ← lat, lng, status: AVAILABLE/ON_TRIP
│   │   └── RideStatus.java           ← enum: SEARCHING/MATCHED/EN_ROUTE/ARRIVED
│   └── config/
│       └── WebSocketConfig.java      ← STOMP over WebSocket config

DATABASE SCHEMA:
rides (id, user_id, driver_id, pickup_lat, pickup_lng, drop_lat, drop_lng,
       status, fare, ride_type, created_at, completed_at)
drivers (id, name, phone, vehicle_type, vehicle_number, current_lat,
         current_lng, status, rating)

KEY REST ENDPOINTS:
POST /api/rides/request             → create ride request
GET  /api/rides/{rideId}/status     → get current ride status
POST /api/rides/{rideId}/cancel     → cancel ride

WEBSOCKET TOPICS (STOMP):
/app/ride.request     → user sends ride request
/topic/ride/{rideId}  → broadcast: driver assigned, status updates
/app/driver.location  → driver sends location update
/topic/driver/{rideId} → broadcast driver location to user

WEBSOCKET CONFIG (WebSocketConfig.java):
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic");
        config.setApplicationDestinationPrefixes("/app");
    }
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws").withSockJS();
    }
}

DRIVER MATCHING (DriverMatchingService.java):
Find nearest available driver using Haversine formula:
double distance = Math.acos(sin(lat1)*sin(lat2) + cos(lat1)*cos(lat2)*cos(lng2-lng1)) * 6371;
Select driver with minimum distance from pickup point.

FARE CALCULATION:
BASE_FARE + (distance_km × RATE_PER_KM × type_multiplier)
Economy: 1.0x, Premium: 1.5x, XL: 2.0x

IMPLEMENTATION STEPS:
1. Spring Boot setup: add spring-websocket, spring-messaging dependencies
2. WebSocketConfig: enable STOMP broker, set prefixes
3. RideController: POST /rides/request → calls DriverMatchingService →
   sends matched driver via SimpMessagingTemplate to /topic/ride/{id}
4. Location updates: driver sends to /app/driver.location → controller
   broadcasts to /topic/driver/{rideId} → user sees driver moving
5. Status machine: SEARCHING → DRIVER_ASSIGNED → EN_ROUTE → ARRIVED →
   COMPLETED; each transition persisted to DB + broadcast via WebSocket
6. Simulate driver movement: @Scheduled bean moves driver's lat/lng
   slightly toward pickup every 3 seconds for demo purposes
```

---

## SD-03: Real-Time Chat Application

```
TECH STACK (from PDF): Node/Java, WebSocket

PROJECT CONTEXT:
Spring Boot + WebSocket chat application supporting 1-on-1 and group
messaging with online status tracking.

BACKEND STRUCTURE:
real-time-chat/backend/
├── src/main/java/com/chat/
│   ├── controller/
│   │   ├── ChatController.java       ← STOMP message handler
│   │   └── UserController.java
│   ├── service/
│   │   ├── MessageService.java
│   │   └── UserPresenceService.java  ← online/offline tracking
│   ├── model/
│   │   ├── Message.java             ← id, roomId, sender, content, timestamp, type
│   │   ├── ChatRoom.java            ← id, name, type: DIRECT/GROUP, members[]
│   │   └── MessageType.java         ← enum: CHAT, JOIN, LEAVE, TYPING
│   └── config/
│       └── WebSocketConfig.java

STOMP MESSAGE HANDLING:
@MessageMapping("/chat.sendMessage/{roomId}")
→ broadcasts to /topic/room/{roomId}

@MessageMapping("/chat.addUser/{roomId}")
→ user joins, notify room via /topic/room/{roomId}

@MessageMapping("/chat.typing/{roomId}")
→ send typing indicator to /topic/typing/{roomId}

DATABASE SCHEMA:
chat_rooms (id, name, type ENUM('DIRECT','GROUP'), created_at)
room_members (room_id, user_id, joined_at)
messages (id, room_id, sender_id, content, message_type,
          sent_at, is_read)

REST ENDPOINTS:
GET  /api/rooms              → get user's chat rooms
POST /api/rooms              → create new room
GET  /api/rooms/{id}/messages → get message history (paginated)
GET  /api/users/online        → list online users

USER PRESENCE:
Track online users in a HashMap<String, String> (userId → sessionId)
in UserPresenceService. Update on @EventListener(SessionConnectEvent)
and @EventListener(SessionDisconnectEvent).

IMPLEMENTATION STEPS:
1. WebSocketConfig: configure STOMP with simple in-memory broker
2. Message entity with @Entity; MessageRepository extends JpaRepository
3. ChatController: @MessageMapping methods receive messages, persist
   to DB, then broadcast via SimpMessagingTemplate
4. Typing indicator: throttled - client sends /chat.typing only every
   2 seconds; server broadcasts to room with 3-second TTL
5. Message history: GET /rooms/{id}/messages with Pageable - returns
   Page<Message> sorted by sent_at DESC with page/size params
6. Read receipts: PATCH /messages/{id}/read updates is_read=true
```

---

## SD-04: URL Shortener System

```
TECH STACK (from PDF): Java/Python, Redis

PROJECT CONTEXT:
High-scale URL shortener using Spring Boot + Redis for caching short
codes with analytics tracking.

BACKEND STRUCTURE:
url-shortener/backend/
├── src/main/java/com/urlshortener/
│   ├── controller/
│   │   ├── UrlController.java
│   │   └── AnalyticsController.java
│   ├── service/
│   │   ├── UrlShortenerService.java  ← code generation + Redis caching
│   │   └── AnalyticsService.java
│   ├── model/
│   │   ├── ShortUrl.java
│   │   └── ClickEvent.java
│   └── config/
│       └── RedisConfig.java

DATABASE SCHEMA:
short_urls (id, original_url, short_code VARCHAR(10) UNIQUE,
            created_at, expires_at, created_by, total_clicks)
click_events (id, short_code, clicked_at, ip_address, user_agent, referrer)

REDIS USAGE:
Cache key: "url:{shortCode}" → value: original_url
TTL: 24 hours (reduces DB hits for popular URLs)

Cache on creation: redisTemplate.opsForValue().set("url:"+code, originalUrl, 24, TimeUnit.HOURS);
Read with cache-aside:
  String cached = redisTemplate.opsForValue().get("url:"+code);
  if (cached != null) return cached;  // cache hit
  return urlRepository.findByShortCode(code).getOriginalUrl();  // cache miss

SHORT CODE GENERATION:
Base62 encoding: characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
Use auto-increment ID → encode to Base62 (6 chars = 62^6 = 56 billion URLs)

REST ENDPOINTS:
POST /api/shorten                → { originalUrl } → returns { shortCode, shortUrl }
GET  /{shortCode}                → 302 redirect to original URL + log click
GET  /api/analytics/{shortCode}  → click stats, referrers, time series
DELETE /api/urls/{shortCode}     → delete (admin only)

REDIS CONFIG:
spring.data.redis.host=localhost
spring.data.redis.port=6379
Add spring-boot-starter-data-redis to pom.xml

IMPLEMENTATION STEPS:
1. pom.xml: add spring-boot-starter-data-redis, spring-boot-starter-data-jpa
2. RedisConfig: @Bean StringRedisTemplate with Jackson serializer
3. Code generation: AtomicLong counter from DB → Base62 encode to 6 chars
4. Redirect endpoint: GET /{code} → check Redis → if miss check DB →
   if found: log ClickEvent asynchronously (@Async), return ResponseEntity
   with HttpStatus.FOUND and Location header
5. Analytics: aggregate click_events by date, group by referrer, get
   hourly distribution for chart data
6. Rate limiting (optional): Redis counter "ratelimit:{ip}" with 1min TTL
```

---

## SD-05: Food Delivery System

```
TECH STACK (from PDF): Java/Spring, REST (microservice workflow)

PROJECT CONTEXT:
Spring Boot microservice-architecture food delivery backend. Separate
services for Orders, Restaurants, Delivery, and Users communicate via REST.

SERVICES STRUCTURE:
food-delivery/
├── order-service/        ← manages order lifecycle
├── restaurant-service/   ← menu management
├── delivery-service/     ← driver assignment
├── user-service/         ← authentication
└── api-gateway/          ← Spring Cloud Gateway (optional, can use single service)

DATABASE SCHEMA (per service):
-- order-service DB
orders (id, user_id, restaurant_id, items JSON, total_amount,
        status ENUM('PLACED','CONFIRMED','PREPARING','OUT_FOR_DELIVERY','DELIVERED'),
        delivery_address, created_at, driver_id)
order_items (id, order_id, item_id, item_name, quantity, price)

-- restaurant-service DB
restaurants (id, name, cuisine, address, rating, is_open)
menu_items (id, restaurant_id, name, description, price, category, is_available)

-- delivery-service DB
drivers (id, name, phone, is_available, current_lat, current_lng)
deliveries (id, order_id, driver_id, status, picked_up_at, delivered_at)

KEY REST ENDPOINTS:
POST /api/orders                       → place order
GET  /api/orders/{id}                  → get order with status
PATCH /api/orders/{id}/status          → update status (restaurant/driver)
GET  /api/restaurants                  → list restaurants
GET  /api/restaurants/{id}/menu        → get menu
POST /api/delivery/assign              → assign driver to order

ORDER STATUS FLOW:
PLACED → restaurant confirms → CONFIRMED → kitchen ready → PREPARING
→ driver picks up → OUT_FOR_DELIVERY → delivered → DELIVERED

IMPLEMENTATION STEPS:
1. Create single Spring Boot app with packages acting as "microservices"
   (order, restaurant, delivery) — monolith with microservice-style structure
2. Each package: its own Controller, Service, Repository, Model
3. Cross-service calls: use RestTemplate or WebClient internally (e.g.
   OrderService calls DeliveryService to assign driver)
4. Order state machine: use enum + validation that only valid transitions
   are allowed (PLACED → CONFIRMED only, not PLACED → DELIVERED)
5. Driver assignment: query available drivers, pick one, update both
   order.driver_id and delivery record
6. Expose /actuator/health per service for monitoring demo
```

---

## SD-06: Online Banking System

```
TECH STACK (from PDF): Java, Spring, MySQL

PROJECT CONTEXT:
Secure Spring Boot banking application with account management, fund
transfers, and statement generation. Focus on transaction atomicity.

BACKEND STRUCTURE:
online-banking/backend/
├── src/main/java/com/banking/
│   ├── controller/
│   │   ├── AccountController.java
│   │   ├── TransactionController.java
│   │   └── AuthController.java
│   ├── service/
│   │   ├── AccountService.java
│   │   ├── TransferService.java      ← @Transactional transfer logic
│   │   └── StatementService.java
│   ├── model/
│   │   ├── Account.java              ← accountNumber, balance, type, status
│   │   ├── Transaction.java          ← type: CREDIT/DEBIT, amount, timestamp
│   │   └── User.java
│   └── security/
│       └── JwtAuthFilter.java

DATABASE SCHEMA:
users (id, name, email, password_hash, created_at)
accounts (id, user_id, account_number VARCHAR(16) UNIQUE,
          account_type ENUM('SAVINGS','CURRENT','FD'),
          balance DECIMAL(15,2), status ENUM('ACTIVE','FROZEN'))
transactions (id, from_account, to_account, amount,
              transaction_type ENUM('DEBIT','CREDIT','TRANSFER'),
              description, reference_id, created_at)

TRANSFER LOGIC (TransferService.java — critical):
@Transactional
public void transfer(String fromAcc, String toAcc, BigDecimal amount) {
    Account from = accountRepository.findByAccountNumber(fromAcc)
        .orElseThrow(() -> new AccountNotFoundException());
    Account to = accountRepository.findByAccountNumber(toAcc)
        .orElseThrow(() -> new AccountNotFoundException());

    if (from.getBalance().compareTo(amount) < 0)
        throw new InsufficientFundsException();

    from.setBalance(from.getBalance().subtract(amount));
    to.setBalance(to.getBalance().add(amount));

    accountRepository.save(from);
    accountRepository.save(to);

    String ref = "TXN" + System.currentTimeMillis();
    transactionRepository.save(new Transaction(fromAcc, toAcc, amount,
        TransactionType.TRANSFER, "Fund Transfer", ref));
}
// @Transactional ensures: if save(to) fails, save(from) is rolled back

REST ENDPOINTS:
POST /api/auth/login                   → JWT token
GET  /api/accounts/my                  → user's accounts
POST /api/transfer                     → fund transfer
GET  /api/accounts/{id}/transactions   → paginated statement
GET  /api/accounts/{id}/statement/pdf  → generate PDF (use iText or Apache PDFBox)

IMPLEMENTATION STEPS:
1. Add Spring Security + JWT dependency; configure filter chain
2. Account number generation: Random 16-digit string on account creation
3. Transfer: @Transactional method as above — test rollback by throwing
   exception after first save
4. Statement: GET endpoint returns transactions between date range;
   sorted by created_at DESC; paginated (page, size params)
5. PDF statement: use Apache PDFBox to generate a simple PDF table of
   transactions; return as byte[] with application/pdf content type
6. Balance masking in response DTOs: only expose last 4 digits in list views
```

---

## SD-07: Digital Wallet System

```
TECH STACK (from PDF): Java/Python, REST

PROJECT CONTEXT:
Spring Boot digital wallet with balance management, P2P transfers,
merchant payments, and transaction history.

DATABASE SCHEMA:
wallets (id, user_id, upi_id VARCHAR(50) UNIQUE, balance DECIMAL(12,2),
         is_active, created_at)
wallet_transactions (id, wallet_id, type ENUM('CREDIT','DEBIT'),
                     amount, counterparty_id, counterparty_name,
                     reference_id, description, created_at)
contacts (id, wallet_id, contact_upi_id, contact_name)

KEY REST ENDPOINTS:
POST /api/wallet/add-money          → { amount } → increase balance
POST /api/wallet/send               → { toUpiId, amount, note } → P2P transfer
POST /api/wallet/pay                → { merchantCode, amount } → merchant payment
GET  /api/wallet/balance            → current balance
GET  /api/wallet/transactions       → paginated history
GET  /api/wallet/contacts           → frequently paid contacts

SEND MONEY LOGIC:
@Transactional
public TransactionResponse send(String fromUpiId, String toUpiId, BigDecimal amount) {
    Wallet sender = walletRepository.findByUpiId(fromUpiId).orElseThrow();
    Wallet receiver = walletRepository.findByUpiId(toUpiId).orElseThrow();
    if (sender.getBalance().compareTo(amount) < 0) throw new InsufficientFundsException();
    sender.setBalance(sender.getBalance().subtract(amount));
    receiver.setBalance(receiver.getBalance().add(amount));
    // Save both + create transaction records for both wallets
    String ref = "WPY" + UUID.randomUUID().toString().substring(0,8).toUpperCase();
    // return success response with reference ID
}

UPI ID FORMAT: {firstName}.{randomNum}@wallet
Generate on wallet creation.

IMPLEMENTATION STEPS:
1. Wallet creation: triggered on user registration; auto-generate UPI ID
2. Add money: simple balance increase; create CREDIT transaction
3. PIN validation: store hashed PIN (BCrypt); validate before every debit
4. Weekly stats: aggregation query:
   SELECT type, SUM(amount) FROM wallet_transactions
   WHERE wallet_id=? AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
   GROUP BY type
5. Contact auto-save: after successful transfer, check if counterparty
   exists in contacts; if not, add automatically
```

---

## SD-08: Hospital Management System

```
TECH STACK (from PDF): Java, MySQL

PROJECT CONTEXT:
Centralized hospital ERP covering patient records, doctor management,
appointment scheduling, and billing.

DATABASE SCHEMA:
patients (id, name, dob, gender, phone, email, blood_group, address, created_at)
doctors (id, name, specialization, qualification, phone, schedule JSON)
appointments (id, patient_id, doctor_id, appointment_date, slot_time,
              status ENUM('SCHEDULED','COMPLETED','CANCELLED'), reason, notes)
medical_records (id, patient_id, doctor_id, appointment_id, diagnosis,
                 prescription TEXT, test_reports TEXT, created_at)
bills (id, patient_id, appointment_id, services JSON, total_amount,
       paid_amount, status ENUM('PENDING','PARTIAL','PAID'))

KEY REST ENDPOINTS:
POST /api/patients                        → register patient
GET  /api/doctors?specialization=cardio   → filter doctors
POST /api/appointments                    → book appointment
GET  /api/appointments/doctor/{id}/today  → doctor's today schedule
POST /api/medical-records                 → add record (doctor only)
GET  /api/patients/{id}/history           → full medical history
POST /api/bills                           → create bill
PATCH /api/bills/{id}/pay                 → record payment

SCHEDULE MANAGEMENT:
Doctor's schedule stored as JSON: { "MON": ["09:00","09:30",...], "TUE": [...] }
When booking: check if slot exists in doctor's schedule AND not already booked
for that date/time combination.

IMPLEMENTATION STEPS:
1. Entities with proper JPA relationships:
   Appointment @ManyToOne Patient, @ManyToOne Doctor
   MedicalRecord @OneToOne Appointment
2. Slot availability: query appointments for doctor+date, collect booked
   slots, return doctor's schedule minus booked slots
3. Role-based access: doctors access their own appointments and add records;
   patients view their own records; admin accesses everything
4. Billing: services JSON array [{name, cost}]; sum for total_amount;
   PATCH /pay updates paid_amount, recalculates status
5. Medical history: JOIN appointments, medical_records, bills WHERE patient_id=?
   ordered by appointment_date DESC
```

---

## SD-09: Smart Parking System

```
TECH STACK (from PDF): Java/Python

PROJECT CONTEXT:
Smart parking management API for a multi-zone parking lot.
Handles slot booking, occupancy tracking, and fee calculation.

DATABASE SCHEMA:
parking_zones (id, zone_name CHAR(1), total_slots, rate_per_hour)
parking_slots (id, zone_id, slot_number, status ENUM('AVAILABLE','OCCUPIED','RESERVED'))
parking_sessions (id, slot_id, vehicle_number, entry_time, exit_time,
                  fee_charged, status ENUM('ACTIVE','COMPLETED'))

KEY REST ENDPOINTS:
GET  /api/slots/availability          → all zones with available count
GET  /api/slots/available?zone=A      → available slots in zone A
POST /api/sessions/enter              → { vehicleNumber, preferredZone? } → assign slot
POST /api/sessions/exit               → { vehicleNumber } → calculate fee + free slot
GET  /api/sessions/active/{vehicleNumber} → get current session
GET  /api/dashboard/stats             → occupancy per zone

FEE CALCULATION:
long hoursParked = ChronoUnit.HOURS.between(session.getEntryTime(), LocalDateTime.now());
long hours = Math.max(1, hoursParked); // minimum 1 hour
BigDecimal fee = zone.getRatePerHour().multiply(BigDecimal.valueOf(hours));

SLOT ASSIGNMENT:
Find first AVAILABLE slot in preferred zone (or any zone if not specified).
Use @Transactional + pessimistic lock:
@Lock(LockModeType.PESSIMISTIC_WRITE) on findFirstByZoneAndStatus query
to prevent two vehicles being assigned the same slot.

IMPLEMENTATION STEPS:
1. Initialize DB with 4 zones (A,B,C,D) × 10 slots each via data.sql
2. /enter: validate vehicle not already parked, assign slot with lock,
   create ParkingSession with entryTime = LocalDateTime.now()
3. /exit: find ACTIVE session by vehicle number, calculate fee, update
   session with exitTime + fee, change slot status to AVAILABLE
4. Dashboard stats: native SQL query for occupancy percentage per zone
5. Scheduled cleanup: sessions with no exit after 24h → auto-close
```

---

## SD-10: Smart Notification System

```
TECH STACK (from PDF): Java, MQ (Message Queue)

PROJECT CONTEXT:
Enterprise notification service using Spring Boot + RabbitMQ (or
ActiveMQ) for reliable email/SMS/push notifications via message queues.

SYSTEM ARCHITECTURE:
Producer (any service) → MQ Exchange → Queues → Consumer (NotificationWorker)
Queues: email.queue, sms.queue, push.queue

BACKEND STRUCTURE:
smart-notification/backend/
├── src/main/java/com/notification/
│   ├── producer/
│   │   └── NotificationProducer.java  ← sends to MQ
│   ├── consumer/
│   │   ├── EmailConsumer.java         ← @RabbitListener
│   │   ├── SmsConsumer.java
│   │   └── PushConsumer.java
│   ├── model/
│   │   └── NotificationEvent.java    ← type, recipient, subject, body, priority
│   └── config/
│       └── RabbitMQConfig.java

RABBITMQ CONFIG:
@Bean Queue emailQueue() { return new Queue("email.queue", true); }
@Bean TopicExchange exchange() { return new TopicExchange("notification.exchange"); }
@Bean Binding binding() {
    return BindingBuilder.bind(emailQueue()).to(exchange()).with("notification.email");
}

PRODUCER:
public void sendNotification(NotificationEvent event) {
    String routingKey = "notification." + event.getType().toLowerCase();
    rabbitTemplate.convertAndSend("notification.exchange", routingKey, event);
}

CONSUMER (EmailConsumer.java):
@RabbitListener(queues = "email.queue")
public void processEmail(NotificationEvent event) {
    // Use JavaMailSender to send actual email
    // Or log for demo: log.info("Sending email to: {}", event.getRecipient());
}

DATABASE SCHEMA:
notification_logs (id, type, recipient, subject, status ENUM('QUEUED','SENT','FAILED'),
                   sent_at, error_message, created_at)

REST ENDPOINTS:
POST /api/notifications/send       → { type, recipient, subject, body } → queues message
GET  /api/notifications/logs       → paginated notification history
GET  /api/notifications/stats      → sent/failed counts by type

IMPLEMENTATION STEPS:
1. pom.xml: add spring-boot-starter-amqp; install RabbitMQ locally or use
   Docker: docker run -d -p 5672:5672 -p 15672:15672 rabbitmq:management
2. Configure RabbitMQConfig with queues, exchange, bindings for 3 channels
3. NotificationEvent: Serializable POJO with type, recipient, subject, body,
   priority, createdAt
4. Consumers: each logs to notification_logs table; simulate send via log statement
5. Retry mechanism: configure RabbitMQ retry with fixed-backoff and max 3 attempts
6. Dead letter queue: failed messages after 3 retries go to notification.dlq
7. REST endpoint: accept notification request → validate → produce to MQ →
   return { status: "QUEUED", messageId: uuid }
```

---

## SD-11: Online Auction System

```
TECH STACK (from PDF): Java/Spring, REST

PROJECT CONTEXT:
Real-time bidding platform with countdown timers, bid validation,
and winner determination using Spring Boot REST + WebSocket.

DATABASE SCHEMA:
auction_items (id, title, description, start_bid, current_bid,
               reserve_price, start_time, end_time, status, seller_id,
               winner_id, image_url, category)
bids (id, item_id, bidder_id, bid_amount, bid_time, is_winning)

KEY REST ENDPOINTS + WEBSOCKET:
GET  /api/auctions                  → list active auctions
GET  /api/auctions/{id}             → auction detail + bid history
POST /api/auctions/{id}/bid         → { bidAmount } → place bid
WS   /topic/auction/{id}            → real-time bid updates broadcast

BID VALIDATION:
@Transactional
public BidResponse placeBid(Long auctionId, BigDecimal amount, Long bidderId) {
    AuctionItem auction = auctionRepository.findById(auctionId)
        .orElseThrow(() -> new AuctionNotFoundException());
    if (auction.getEndTime().isBefore(LocalDateTime.now()))
        throw new AuctionExpiredException();
    if (amount.compareTo(auction.getCurrentBid().add(new BigDecimal("10"))) < 0)
        throw new BidTooLowException("Bid must be at least ₹10 more than current bid");
    auction.setCurrentBid(amount);
    // save auction, save bid record, broadcast via SimpMessagingTemplate
}

AUCTION EXPIRY:
@Scheduled(fixedRate = 10000) checkAndCloseExpiredAuctions()
Find auctions WHERE end_time < NOW() AND status = 'ACTIVE'
→ set status = 'CLOSED', winner_id = last winning bid's bidder_id

IMPLEMENTATION STEPS:
1. AuctionItem entity with status enum: UPCOMING/ACTIVE/CLOSED
2. Scheduled task: activate UPCOMING auctions when start_time reached;
   close ACTIVE auctions when end_time passed
3. Bid endpoint: atomic update with optimistic locking (@Version on current_bid)
4. WebSocket broadcast: after successful bid, send BidUpdate to /topic/auction/{id}
5. Winner notification: on auction close, log winner to notification queue
6. Extension rule: if bid placed in last 2 minutes, extend end_time by 2 minutes
```

---

## SD-12: Recommendation System (AI/ML)

```
TECH STACK (from PDF): Python/Java

PROJECT CONTEXT:
Python Flask/FastAPI recommendation engine using collaborative filtering
to suggest products/content. Can be called as a microservice from Java backend.

PYTHON SERVICE STRUCTURE:
recommendation-system/
├── app.py                    ← Flask/FastAPI REST API
├── recommender.py            ← collaborative filtering logic
├── data/
│   └── ratings.csv           ← sample user-item ratings matrix
└── requirements.txt          ← flask, numpy, pandas, scikit-learn

CORE ALGORITHM (recommender.py):
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd

class CollaborativeFilter:
    def __init__(self, ratings_matrix):
        self.matrix = ratings_matrix  # users × items DataFrame
        self.similarity = cosine_similarity(ratings_matrix.fillna(0))
        self.sim_df = pd.DataFrame(self.similarity,
                                   index=ratings_matrix.index,
                                   columns=ratings_matrix.index)

    def get_recommendations(self, user_id, n=5):
        similar_users = self.sim_df[user_id].sort_values(ascending=False)[1:6]
        unrated_items = self.matrix.columns[self.matrix.loc[user_id].isna()]
        scores = {}
        for item in unrated_items:
            weighted_sum = 0
            sim_sum = 0
            for sim_user, sim_score in similar_users.items():
                rating = self.matrix.loc[sim_user, item]
                if not np.isnan(rating):
                    weighted_sum += sim_score * rating
                    sim_sum += sim_score
            if sim_sum > 0:
                scores[item] = weighted_sum / sim_sum
        return sorted(scores, key=scores.get, reverse=True)[:n]

FLASK API (app.py):
@app.route('/recommend/<user_id>')
def recommend(user_id):
    recommendations = cf.get_recommendations(user_id)
    return jsonify({'recommendations': recommendations, 'user': user_id})

@app.route('/similar-users/<user_id>')
def similar_users(user_id):
    similar = cf.sim_df[user_id].sort_values(ascending=False)[1:6]
    return jsonify({'similar_users': similar.to_dict()})

SAMPLE DATA (ratings.csv):
user_id,item1,item2,item3,item4,item5,...
user1,5,3,,1,4,...
user2,,4,3,,5,...
(empty = not rated)

REST ENDPOINTS:
GET /recommend/{userId}           → top N recommendations for user
GET /similar-users/{userId}       → most similar users (for explainability)
GET /item-popularity              → most rated items

IMPLEMENTATION STEPS:
1. Generate synthetic ratings.csv: 20 users × 30 items, 40% sparsity
2. Load CSV into pandas DataFrame on startup
3. Build CollaborativeFilter instance with the matrix
4. Flask routes as defined above, return JSON responses
5. requirements.txt: flask, numpy, pandas, scikit-learn
6. Run: python app.py (port 5000)
7. Optional: Java Spring Boot service calls this via RestTemplate as
   external microservice
```

---

# 🚀 FULL STACK DEVELOPMENT — AI PROMPTS
> **Tech Stack for ALL Full Stack projects (from PDF):**
> **Frontend:** React + Redux Toolkit (or Context API) + Axios
> **Backend:** Spring Boot + JWT + JPA
> **Database:** MySQL
> **Containerization:** Docker
> **Testing:** Jest (frontend), JUnit (backend)

---

## FS-01: Smart Role-Based College Management Portal

```
TECH STACK (from PDF): React, Redux Toolkit, Spring Boot, JWT, JPA, Docker

PROJECT CONTEXT:
Full-stack college management portal with role-based access for Admin,
Faculty, and Students. JWT authentication + Spring Security for route protection.

FRONTEND STRUCTURE:
college-portal/frontend/src/
├── store/
│   ├── store.js                 ← Redux Toolkit store
│   ├── authSlice.js             ← login state, JWT token
│   ├── studentSlice.js
│   └── announcementSlice.js
├── components/
│   ├── Navbar.jsx
│   ├── ProtectedRoute.jsx       ← checks role from Redux
│   └── Sidebar.jsx
├── pages/
│   ├── Login.jsx
│   ├── admin/
│   │   ├── AdminDashboard.jsx
│   │   └── ManageStudents.jsx
│   ├── faculty/
│   │   ├── FacultyDashboard.jsx
│   │   └── MarkAttendance.jsx
│   └── student/
│       ├── StudentDashboard.jsx
│       └── ViewMarks.jsx
└── services/
    └── api.js                   ← Axios instance with JWT interceptor

BACKEND STRUCTURE:
college-portal/backend/src/main/java/com/collegeportal/
├── controller/
│   ├── AuthController.java
│   ├── AdminController.java      ← @PreAuthorize("hasRole('ADMIN')")
│   ├── FacultyController.java    ← @PreAuthorize("hasRole('FACULTY')")
│   └── StudentController.java    ← @PreAuthorize("hasRole('STUDENT')")
├── service/
│   ├── AuthService.java
│   ├── StudentService.java
│   └── AttendanceService.java
├── model/
│   ├── User.java                 ← @Entity, roles: Set<Role>
│   ├── Student.java
│   ├── Course.java
│   ├── Attendance.java
│   └── Marks.java
├── security/
│   ├── JwtUtil.java              ← generate/validate JWT
│   ├── JwtAuthFilter.java        ← OncePerRequestFilter
│   └── SecurityConfig.java      ← configure HttpSecurity
└── repository/

JWT FLOW:
1. POST /api/auth/login → validate credentials → generate JWT (userId, role, exp)
2. Client stores JWT in localStorage
3. Axios interceptor adds: headers['Authorization'] = `Bearer ${token}`
4. JwtAuthFilter extracts token → validates → sets SecurityContextHolder
5. @PreAuthorize on controllers checks role from security context

DOCKER-COMPOSE.YML:
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: collegedb
    ports: ["3306:3306"]
  backend:
    build: ./backend
    depends_on: [mysql]
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/collegedb
    ports: ["8080:8080"]
  frontend:
    build: ./frontend
    depends_on: [backend]
    ports: ["3000:80"]

APPLICATION.PROPERTIES:
spring.datasource.url=jdbc:mysql://localhost:3306/collegedb
spring.datasource.username=root
spring.datasource.password=root
spring.jpa.hibernate.ddl-auto=update
jwt.secret=your-256-bit-secret-key
jwt.expiration=86400000

IMPLEMENTATION STEPS:
1. Backend: Spring Initializr with web, data-jpa, mysql, security, lombok
2. User entity with @ManyToMany roles; UserDetailsService implementation
3. JwtUtil: generate token with Jwts.builder(), parse with Jwts.parserBuilder()
4. SecurityConfig: disable CSRF, add JwtAuthFilter before UsernamePasswordAuthenticationFilter
5. Frontend: Create React App; install react-router-dom, @reduxjs/toolkit, react-redux, axios
6. authSlice: createAsyncThunk for login API call; store { token, user, role } in Redux
7. ProtectedRoute: check Redux auth.role; redirect if unauthorized
8. Each role's dashboard calls its own protected API endpoints
```

---

## FS-02: Secure Online Examination System

```
TECH STACK (from PDF): React, Context API, Redux, Spring Boot, JWT

PROJECT CONTEXT:
Full-stack exam platform. Teachers create exams, students take timed
exams, results auto-process. JWT secures teacher vs student routes.

FRONTEND STRUCTURE:
exam-system/frontend/src/
├── context/
│   └── ExamContext.jsx         ← Context API for exam state
├── store/
│   └── authSlice.js            ← Redux for auth
├── pages/
│   ├── teacher/
│   │   ├── CreateExam.jsx
│   │   └── ViewResults.jsx
│   └── student/
│       ├── ExamList.jsx
│       ├── TakeExam.jsx        ← timer + question navigation
│       └── Results.jsx
└── components/
    ├── Timer.jsx               ← countdown with warning at <5min
    ├── QuestionCard.jsx
    └── ProgressDots.jsx

BACKEND REST ENDPOINTS:
POST /api/exams                        ← teacher creates exam
POST /api/exams/{id}/questions         ← add questions
GET  /api/exams/available              ← student sees available exams
POST /api/submissions/start/{examId}   ← student starts (records start_time)
POST /api/submissions/submit           ← { examId, answers: [{qId, answer}] }
GET  /api/results/{examId}             ← teacher sees all results
GET  /api/results/my/{examId}          ← student sees own result

DATABASE SCHEMA:
exams (id, title, subject, duration_minutes, teacher_id, is_published, created_at)
questions (id, exam_id, question_text, option_a, option_b, option_c, option_d,
           correct_option CHAR(1), marks)
submissions (id, exam_id, student_id, start_time, submit_time, score,
             status ENUM('IN_PROGRESS','SUBMITTED','AUTO_SUBMITTED'))
answers (id, submission_id, question_id, selected_option, is_correct)

AUTO-SUBMIT LOGIC:
Student frontend sends periodic heartbeat to /api/submissions/{id}/heartbeat
Backend: @Scheduled checks submissions with status=IN_PROGRESS where
start_time + duration < now() → auto-submit them (evaluate + set SUBMITTED)

EXAM EVALUATION (SubmissionService.java):
public int evaluate(Submission submission, List<Answer> answers) {
    int score = 0;
    for (Answer answer : answers) {
        Question q = questionRepository.findById(answer.getQuestionId()).orElseThrow();
        answer.setIsCorrect(answer.getSelectedOption().equals(q.getCorrectOption()));
        if (answer.getIsCorrect()) score += q.getMarks();
    }
    return score;
}

IMPLEMENTATION STEPS:
1. Question entity: 4 options + correct_option stored as char (A/B/C/D)
2. Frontend timer: useEffect with setInterval; decrement seconds; on 0
   auto-submit via API call; warn at 5min with color change
3. Context API for exam state: { currentQuestion, answers, timeRemaining,
   examId, submissionId } — persisted to sessionStorage for tab refresh
4. Anti-cheat: visibilitychange event listener sends warning to backend;
   backend stores tab_switch_count in submission; teacher can see this
5. Results: Spring calculates score on submit, returns { score, total, percentage,
   question_breakdown: [{qId, isCorrect, correctAnswer}] }
```

---

## FS-03: Multi-Vendor E-Commerce Platform

```
TECH STACK (from PDF): React, Redux Toolkit, Spring Boot, JWT, Docker

PROJECT CONTEXT:
Scalable e-commerce marketplace with vendor and buyer roles, product
catalog, cart management, and order processing.

FRONTEND STRUCTURE:
ecommerce/frontend/src/
├── store/
│   ├── cartSlice.js            ← cart state + persist to localStorage
│   ├── productSlice.js         ← product listing + filters
│   └── authSlice.js
├── pages/
│   ├── ProductListing.jsx      ← filters, search, pagination
│   ├── ProductDetail.jsx       ← images, reviews, add to cart
│   ├── Cart.jsx
│   ├── Checkout.jsx
│   └── vendor/
│       ├── VendorDashboard.jsx
│       └── ManageProducts.jsx

BACKEND REST ENDPOINTS:
GET  /api/products?category=&minPrice=&maxPrice=&vendorId=&sort=
POST /api/products                    ← vendor adds product
PUT  /api/products/{id}               ← vendor updates
DELETE /api/products/{id}             ← vendor deletes
POST /api/cart/add                    ← { productId, quantity }
GET  /api/cart                        ← get current user's cart
POST /api/orders                      ← place order from cart
GET  /api/orders/my                   ← buyer's order history
GET  /api/orders/vendor               ← vendor sees their orders

DATABASE SCHEMA:
vendors (id, user_id, business_name, gst_number, is_verified)
products (id, vendor_id, name, description, price, stock_quantity,
          category, images JSON, avg_rating, total_reviews)
cart_items (id, user_id, product_id, quantity, added_at)
orders (id, buyer_id, total_amount, status, delivery_address, created_at)
order_items (id, order_id, product_id, vendor_id, quantity, price_at_purchase)
reviews (id, product_id, user_id, rating INT, comment, created_at)

REDUX CART SLICE:
export const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], total: 0 },
  reducers: {
    addItem: (state, action) => {
      const existing = state.items.find(i => i.productId === action.payload.productId);
      if (existing) existing.quantity++;
      else state.items.push({ ...action.payload, quantity: 1 });
      state.total = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(i => i.productId !== action.payload);
    }
  }
});

IMPLEMENTATION STEPS:
1. Product listing: Redux thunk fetches /api/products with query params;
   filter state in productSlice; debounce search input (500ms)
2. Product comparison: store up to 3 productIds in comparisonSlice;
   comparison page renders side-by-side specs table
3. Vendor JWT role: vendor endpoints check @PreAuthorize("hasRole('VENDOR')");
   vendor can only CRUD their own products (check vendorId == authenticated user)
4. Cart sync: persist Redux cart to localStorage; sync to backend cart on login
5. Order placement: POST /orders → backend validates stock, deducts inventory,
   creates order + order_items records
6. Docker: separate Dockerfile for frontend (nginx) and backend; compose together
```

---

## FS-04: Employee Attendance & Payroll System

```
TECH STACK (from PDF): React, Redux, Spring Boot, JWT

PROJECT CONTEXT:
HR management system with clock-in/out attendance tracking and automated
payroll calculation based on attendance records.

BACKEND REST ENDPOINTS:
POST /api/attendance/clockin        ← { employeeId } → records timestamp
POST /api/attendance/clockout       ← { employeeId } → calculates hours
GET  /api/attendance/{employeeId}?month=&year=  ← monthly report
POST /api/payroll/generate          ← { month, year } → generate payslips
GET  /api/payroll/{employeeId}?month= ← get payslip
GET  /api/employees                 ← HR views all employees

DATABASE SCHEMA:
employees (id, name, employee_code, department, designation, salary_grade,
           base_salary DECIMAL(10,2), join_date)
attendance (id, employee_id, date, clock_in TIMESTAMP, clock_out TIMESTAMP,
            hours_worked DECIMAL(4,2), status ENUM('PRESENT','ABSENT','HALF_DAY','LEAVE'))
payroll (id, employee_id, month, year, working_days, days_present,
         basic_salary, hra, pf_deduction, tax_deduction, net_salary, generated_at)

PAYROLL CALCULATION:
Basic = base_salary / total_working_days * days_present
HRA = Basic * 0.40
PF Deduction = Basic * 0.12
Tax = (Annual Gross > 250000) ? Gross * 0.10 : 0
Net Salary = Basic + HRA - PF - Tax

ATTENDANCE REPORT (monthly):
List all days in month → for each day check attendance record:
- Present: clock_in exists + clock_out exists
- Half Day: hours_worked < 4
- Absent: no record
Count working days (exclude Sundays), calculate attendance percentage

IMPLEMENTATION STEPS:
1. Clock-in: find employee, create attendance record with clock_in = now()
2. Clock-out: find today's open record, set clock_out = now(),
   calculate hours_worked = HOURS_BETWEEN(clock_in, clock_out)
3. Payroll generation: for each employee, aggregate their attendance for
   the month, calculate all components, save payroll record
4. Frontend: attendance calendar view (CSS grid of month days, colored
   by status); payroll breakdown card with all components
5. Leave management: employee applies → manager approves → marks as LEAVE
   (counts as present for pay calculation)
```

---

## FS-05: Learning Management System (LMS)

```
TECH STACK (from PDF): React, Context API, Spring Boot, JWT

PROJECT CONTEXT:
E-learning platform with course enrollment, video lessons, quizzes,
and progress tracking.

FRONTEND CONTEXT API:
const CourseContext = createContext();
State: { enrolledCourses, currentCourse, progress, completedLessons }

BACKEND REST ENDPOINTS:
GET  /api/courses                       ← browse courses
POST /api/courses/{id}/enroll           ← enroll student
GET  /api/courses/{id}/lessons          ← get lesson list
POST /api/progress                      ← { lessonId, completed: true }
GET  /api/progress/{courseId}           ← % completion
POST /api/courses/{id}/quiz/submit      ← submit quiz answers
GET  /api/enrollments/my                ← student's enrolled courses

DATABASE SCHEMA:
courses (id, title, instructor_id, description, thumbnail_url, duration_hours,
         level ENUM('BEGINNER','INTERMEDIATE','ADVANCED'), price, is_published)
lessons (id, course_id, title, video_url, duration_minutes, order_index, lesson_type)
enrollments (id, course_id, student_id, enrolled_at, completion_percentage)
lesson_progress (id, enrollment_id, lesson_id, completed_at)
quiz_questions (id, course_id, question_text, options JSON, correct_option)
quiz_submissions (id, course_id, student_id, score, submitted_at)

PROGRESS CALCULATION:
@Query("SELECT COUNT(lp) * 100.0 / COUNT(l) FROM Lesson l LEFT JOIN
        LessonProgress lp ON l.id = lp.lessonId AND lp.enrollmentId = :enrollmentId
        WHERE l.courseId = :courseId")
Double calculateProgress(Long courseId, Long enrollmentId);

Certificate trigger: when progress reaches 100% → mark enrollment as completed;
expose GET /api/certificates/{enrollmentId} endpoint.

IMPLEMENTATION STEPS:
1. Course creation: instructor uploads lesson details (video URLs from YouTube)
2. Enrollment: POST /enroll checks course.is_published; creates enrollment record
3. Progress: POST /progress when student marks lesson complete; triggers
   percentage recalculation; update enrollment.completion_percentage
4. Context API: wrap LessonPlayer in CourseProvider; useContext gives access
   to progress + markComplete function
5. Quiz: compare submitted answers to correct_option; calculate score/total;
   require 80%+ for certificate eligibility
```

---

## FS-06: Digital Expense Tracker

```
TECH STACK (from PDF): React, Redux, Charts, Spring Boot

PROJECT CONTEXT:
Personal finance tracker with category-wise expense analysis,
budget limits, and Chart.js visualizations.

FRONTEND CHARTS:
- Donut chart (spending by category): react-chartjs-2 Doughnut
- Line chart (monthly trend): react-chartjs-2 Line
- Bar chart (budget vs actual): react-chartjs-2 Bar

BACKEND REST ENDPOINTS:
POST /api/transactions                  ← add income/expense
GET  /api/transactions?month=&category= ← filtered list
GET  /api/analytics/monthly-summary     ← { income, expenses, balance }
GET  /api/analytics/by-category?month=  ← { category: amount } map
GET  /api/analytics/trend?months=6      ← last 6 months data for chart
POST /api/budgets                        ← set category budget limit
GET  /api/budgets/status?month=         ← budget vs actual per category

DATABASE SCHEMA:
transactions (id, user_id, type ENUM('INCOME','EXPENSE'), amount,
              category, note, transaction_date, created_at)
budgets (id, user_id, category, monthly_limit, month, year)

ANALYTICS QUERIES:
-- Monthly summary
SELECT type, SUM(amount) FROM transactions
WHERE user_id=? AND MONTH(transaction_date)=? AND YEAR(transaction_date)=?
GROUP BY type

-- Category breakdown
SELECT category, SUM(amount) FROM transactions
WHERE user_id=? AND type='EXPENSE' AND MONTH(transaction_date)=?
GROUP BY category

IMPLEMENTATION STEPS:
1. Redux slice: transactionSlice with async thunks for CRUD + analytics fetching
2. Chart data: transform API response into Chart.js datasets format
3. Budget alerts: compare category spending vs budget limit; return
   { category, spent, limit, percentage, isOverBudget } from backend
4. CSV export: GET /api/transactions/export → Spring returns ResponseEntity<byte[]>
   with Content-Disposition: attachment; filename="transactions.csv"
5. Recurring transactions: cron @Scheduled to auto-add recurring entries on due date
```

---

## FS-07: Real-Time Notification System

```
TECH STACK (from PDF): React, WebSockets, Spring Boot

PROJECT CONTEXT:
Real-time notification delivery system using WebSockets + STOMP.
Supports different notification types with priority and read receipts.

WEBSOCKET FLOW:
1. User connects: CONNECT → /ws/notifications
2. Subscribe: /user/queue/notifications (user-specific channel)
3. Server pushes notification via SimpMessagingTemplate.convertAndSendToUser()
4. Client receives, shows toast, increments badge count

BACKEND STOMP:
@Controller
public class NotificationController {
    @Autowired SimpMessagingTemplate messagingTemplate;

    public void sendToUser(String userId, NotificationDTO notification) {
        messagingTemplate.convertAndSendToUser(userId, "/queue/notifications", notification);
    }
}

// Trigger from any service:
notificationController.sendToUser("user123",
    new NotificationDTO("ORDER_UPDATE", "Your order has been shipped!", "HIGH"));

DATABASE SCHEMA:
notifications (id, user_id, type VARCHAR(50), title, message, is_read,
               priority ENUM('LOW','MEDIUM','HIGH'), created_at, read_at)

REST ENDPOINTS (for notification history):
GET  /api/notifications             ← unread notifications for current user
PATCH /api/notifications/{id}/read  ← mark as read
PATCH /api/notifications/read-all   ← mark all as read
GET  /api/notifications/count       ← unread count for badge

REACT WEBSOCKET SETUP:
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const stompClient = Stomp.over(new SockJS('/ws/notifications'));
stompClient.connect({ Authorization: `Bearer ${token}` }, () => {
    stompClient.subscribe(`/user/queue/notifications`, (message) => {
        const notification = JSON.parse(message.body);
        dispatch(addNotification(notification));
        showToast(notification);
    });
});

IMPLEMENTATION STEPS:
1. WebSocket config: enable user destination prefix (/user) for private channels
2. NotificationService: central service other modules call to send notifications
3. Frontend: connect on login, disconnect on logout; useEffect hook with cleanup
4. Redux notificationSlice: { notifications: [], unreadCount: 0 }; addNotification
   increments unreadCount; markRead decrements
5. Toast component: React portal rendering toast stack in bottom-right corner
6. Priority styling: HIGH = red, MEDIUM = amber, LOW = blue
```

---

## FS-08: Task & Project Collaboration Tool

```
TECH STACK (from PDF): React, WebSockets, Spring Boot

PROJECT CONTEXT:
Team collaboration tool with Kanban board, real-time updates via
WebSocket so all team members see task movements live.

KEY WEBSOCKET EVENTS:
/topic/board/{projectId}  ← all members subscribed to this board
Events broadcast: TASK_CREATED, TASK_MOVED, TASK_UPDATED, TASK_DELETED

BACKEND:
POST /api/projects
POST /api/projects/{id}/tasks
PATCH /api/tasks/{id}              ← update (triggers WebSocket broadcast)
PATCH /api/tasks/{id}/move         ← { targetColumn } (triggers broadcast)
GET  /api/projects/{id}/board      ← full board state

DATABASE SCHEMA:
projects (id, name, description, owner_id, created_at)
project_members (project_id, user_id, role ENUM('OWNER','MEMBER'))
tasks (id, project_id, title, description, column_status,
       assignee_id, priority, due_date, order_index, created_at)

REAL-TIME MOVE:
@MessageMapping("/board.moveTask")
@SendTo("/topic/board/{projectId}")
public TaskEvent moveTask(TaskMoveMessage message, @DestinationVariable Long projectId) {
    Task task = taskService.moveTask(message.getTaskId(), message.getTargetColumn());
    return new TaskEvent("TASK_MOVED", task);
}

IMPLEMENTATION STEPS:
1. Board state: GET /board returns { columns: { TODO: [tasks], IN_PROGRESS: [...], DONE: [...] } }
2. React Kanban: render columns from board state; use react-beautiful-dnd for
   drag-and-drop; on drag end → PATCH /tasks/{id}/move → WebSocket broadcasts
3. All team members subscribed to /topic/board/{projectId} receive the move event
   and update their local Redux state
4. Optimistic updates: update local state immediately on drag, rollback if API fails
5. Task detail modal: edit all fields, add comments, set assignee from project members
```

---

## FS-09: CI/CD Enabled Full Stack Application (DevOps)

```
TECH STACK (from PDF): React, Spring Boot, Docker, GitHub Actions

PROJECT CONTEXT:
Full-stack todo app with complete CI/CD pipeline demonstrating automated
testing, Docker build, and deployment workflow.

GITHUB ACTIONS (.github/workflows/ci-cd.yml):
name: CI/CD Pipeline
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-java@v3
        with: { java-version: '17', distribution: 'temurin' }
      - run: cd backend && mvn test

  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with: { node-version: '18' }
      - run: cd frontend && npm install && npm test -- --watchAll=false

  build-and-push:
    needs: [test-backend, test-frontend]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Login to GitHub Container Registry
        uses: docker/login-action@v2
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - name: Build and push backend
        run: |
          docker build -t ghcr.io/${{ github.repository }}/backend:${{ github.sha }} ./backend
          docker push ghcr.io/${{ github.repository }}/backend:${{ github.sha }}
      - name: Build and push frontend
        run: |
          docker build -t ghcr.io/${{ github.repository }}/frontend:${{ github.sha }} ./frontend
          docker push ghcr.io/${{ github.repository }}/frontend:${{ github.sha }}

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    steps:
      - name: Deploy (simulated)
        run: echo "Deployed version ${{ github.sha }} to production"

BACKEND DOCKERFILE:
FROM maven:3.9-openjdk-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

FRONTEND DOCKERFILE:
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80

DOCKER-COMPOSE.YML:
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    environment: { MYSQL_ROOT_PASSWORD: root, MYSQL_DATABASE: tododb }
  backend:
    build: ./backend
    depends_on: [mysql]
    ports: ["8080:8080"]
  frontend:
    build: ./frontend
    depends_on: [backend]
    ports: ["3000:80"]

IMPLEMENTATION STEPS:
1. Simple Todo app: CRUD via Spring Boot REST + React frontend
2. JUnit test: @SpringBootTest test for TodoController GET/POST/DELETE
3. Jest test: render TodoList component, check items appear
4. Both test suites must pass before Docker build step runs
5. docker-compose up builds and starts everything with one command
6. README: architecture diagram + setup instructions
```

---

# ☁️ CLOUD COMPUTING — AI PROMPTS
> **Tech Stack for ALL Cloud projects (from PDF):**
> AWS services as specified per project. All Lambda functions in **Python (boto3)**.
> Infrastructure: AWS CLI commands. Containerization: Docker + AWS ECS.

---

## CC-01: Personal Portfolio Website on EC2

```
TECH STACK (from PDF): AWS EC2, Apache

SETUP GUIDE (setup-guide.md):

# Step 1: Launch EC2 t2.micro
aws ec2 run-instances \
  --image-id ami-0c02fb55956c7d316 \
  --instance-type t2.micro \
  --key-name MyKeyPair \
  --security-group-ids sg-xxxxxxxx \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=PortfolioServer}]'

# Step 2: Allow HTTP + SSH in Security Group
aws ec2 authorize-security-group-ingress --group-id sg-xxx --protocol tcp --port 22 --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress --group-id sg-xxx --protocol tcp --port 80 --cidr 0.0.0.0/0

# Step 3: SSH and install Apache
ssh -i MyKeyPair.pem ec2-user@<PUBLIC-IP>
sudo yum update -y
sudo yum install httpd -y
sudo systemctl start httpd
sudo systemctl enable httpd

# Step 4: Upload website
scp -i MyKeyPair.pem -r ./portfolio/* ec2-user@<PUBLIC-IP>:/var/www/html/

# Step 5: Access your site
# http://<EC2-PUBLIC-IP>

WEBSITE TO BUILD (HTML/CSS/JS):
Clean personal portfolio with sections: Hero, About, Projects, Skills, Contact.
No frameworks — pure HTML/CSS/JS for simplicity on EC2.

APACHE CONFIG (/etc/httpd/conf.d/portfolio.conf):
<VirtualHost *:80>
    DocumentRoot /var/www/html
    DirectoryIndex index.html
    <Directory /var/www/html>
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>

FILE STRUCTURE:
portfolio-on-ec2/
├── setup-guide.md
├── website/
│   ├── index.html
│   ├── style.css
│   └── script.js
└── aws-setup/
    └── apache-config.conf
```

---

## CC-02: Photo Gallery with S3

```
TECH STACK (from PDF): AWS S3

SETUP GUIDE:

# Step 1: Create S3 bucket
aws s3 mb s3://my-photo-gallery-2026 --region us-east-1

# Step 2: Enable static website hosting
aws s3 website s3://my-photo-gallery-2026/ \
  --index-document index.html \
  --error-document error.html

# Step 3: Set public-read bucket policy
aws s3api put-bucket-policy --bucket my-photo-gallery-2026 --policy '{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::my-photo-gallery-2026/*"
  }]
}'

# Step 4: Disable Block Public Access (required for public policy)
aws s3api put-public-access-block --bucket my-photo-gallery-2026 \
  --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"

# Step 5: Upload gallery files
aws s3 sync ./gallery/ s3://my-photo-gallery-2026/

# Step 6: Upload images
aws s3 cp ./images/ s3://my-photo-gallery-2026/images/ --recursive

# Access URL:
# http://my-photo-gallery-2026.s3-website-us-east-1.amazonaws.com

GALLERY (HTML/JS):
- Masonry grid layout
- Click image → lightbox overlay
- Images loaded from relative S3 paths: ./images/photo1.jpg
```

---

## CC-03: Multi-Region S3 Backup

```
TECH STACK (from PDF): AWS S3

SETUP GUIDE:

# Step 1: Create source bucket (us-east-1)
aws s3 mb s3://backup-source-2026 --region us-east-1

# Step 2: Create destination bucket (ap-south-1 = Mumbai)
aws s3 mb s3://backup-dest-2026 --region ap-south-1

# Step 3: Enable versioning on BOTH buckets (required for replication)
aws s3api put-bucket-versioning --bucket backup-source-2026 \
  --versioning-configuration Status=Enabled
aws s3api put-bucket-versioning --bucket backup-dest-2026 \
  --versioning-configuration Status=Enabled

# Step 4: Create IAM role for replication
aws iam create-role --role-name S3ReplicationRole --assume-role-policy-document '{
  "Version":"2012-10-17",
  "Statement":[{"Effect":"Allow","Principal":{"Service":"s3.amazonaws.com"},
  "Action":"sts:AssumeRole"}]
}'

# Step 5: Configure replication
aws s3api put-bucket-replication --bucket backup-source-2026 \
  --replication-configuration '{
    "Role": "arn:aws:iam::ACCOUNT_ID:role/S3ReplicationRole",
    "Rules": [{"Status": "Enabled",
               "Destination": {"Bucket": "arn:aws:s3:::backup-dest-2026",
                                "StorageClass": "STANDARD_IA"},
               "Filter": {"Prefix": ""}}]
  }'

# Step 6: Test replication
aws s3 cp test-file.txt s3://backup-source-2026/
# Wait 1-2 minutes, then verify:
aws s3 ls s3://backup-dest-2026/

DEMO UI (HTML/JS): World map SVG showing us-east-1 → ap-south-1 replication
with animated file transfer dots.
```

---

## CC-04: EC2 Instance Auto-Stop Scheduler

```
TECH STACK (from PDF): AWS EC2, Lambda

LAMBDA FUNCTION (lambda_stop.py):
import boto3
import json

def lambda_handler(event, context):
    ec2 = boto3.client('ec2', region_name='us-east-1')
    # Get instances tagged with AutoStop=true
    response = ec2.describe_instances(
        Filters=[{'Name': 'tag:AutoStop', 'Values': ['true']},
                 {'Name': 'instance-state-name', 'Values': ['running']}]
    )
    instance_ids = [i['InstanceId']
                    for r in response['Reservations']
                    for i in r['Instances']]
    if instance_ids:
        ec2.stop_instances(InstanceIds=instance_ids)
        print(f"Stopped instances: {instance_ids}")
        return {'stopped': instance_ids}
    return {'message': 'No instances to stop'}

LAMBDA FUNCTION (lambda_start.py):
import boto3
def lambda_handler(event, context):
    ec2 = boto3.client('ec2')
    response = ec2.describe_instances(
        Filters=[{'Name': 'tag:AutoStop', 'Values': ['true']},
                 {'Name': 'instance-state-name', 'Values': ['stopped']}]
    )
    instance_ids = [i['InstanceId']
                    for r in response['Reservations']
                    for i in r['Instances']]
    if instance_ids:
        ec2.start_instances(InstanceIds=instance_ids)
    return {'started': instance_ids}

SETUP GUIDE:
# 1. Create IAM role for Lambda with EC2 permissions
aws iam create-role --role-name LambdaEC2Role --assume-role-policy-document file://lambda-trust.json
aws iam attach-role-policy --role-name LambdaEC2Role \
  --policy-arn arn:aws:iam::aws:policy/AmazonEC2FullAccess

# 2. Deploy Lambda functions
aws lambda create-function --function-name StopEC2 \
  --runtime python3.11 --handler lambda_stop.lambda_handler \
  --role arn:aws:iam::ACCOUNT:role/LambdaEC2Role \
  --zip-file fileb://lambda_stop.zip

# 3. Create EventBridge rules
# Stop at 10PM weekdays (IST = 4:30PM UTC)
aws events put-rule --name StopEC2Rule --schedule-expression "cron(30 16 ? * MON-FRI *)"
# Start at 8AM weekdays (IST = 2:30AM UTC)
aws events put-rule --name StartEC2Rule --schedule-expression "cron(30 2 ? * MON-FRI *)"

# 4. Add Lambda as target
aws events put-targets --rule StopEC2Rule \
  --targets "Id=StopTarget,Arn=arn:aws:lambda:us-east-1:ACCOUNT:function:StopEC2"

# 5. Tag EC2 instances you want auto-managed
aws ec2 create-tags --resources i-xxxx --tags Key=AutoStop,Value=true
```

---

## CC-05: VPC with Public-Private Architecture

```
TECH STACK (from PDF): AWS VPC

SETUP SCRIPT (vpc-setup.sh):
#!/bin/bash
# Full VPC Public-Private Architecture Setup

# 1. Create VPC
VPC_ID=$(aws ec2 create-vpc --cidr-block 10.0.0.0/16 \
  --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=MyVPC}]' \
  --query 'Vpc.VpcId' --output text)
echo "VPC: $VPC_ID"

# 2. Create Public Subnet (AZ-a)
PUB_SUBNET=$(aws ec2 create-subnet \
  --vpc-id $VPC_ID --cidr-block 10.0.1.0/24 \
  --availability-zone us-east-1a \
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=PublicSubnet}]' \
  --query 'Subnet.SubnetId' --output text)

# 3. Create Private Subnet (AZ-b)
PRIV_SUBNET=$(aws ec2 create-subnet \
  --vpc-id $VPC_ID --cidr-block 10.0.2.0/24 \
  --availability-zone us-east-1b \
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=PrivateSubnet}]' \
  --query 'Subnet.SubnetId' --output text)

# 4. Internet Gateway (for public subnet)
IGW=$(aws ec2 create-internet-gateway --query 'InternetGateway.InternetGatewayId' --output text)
aws ec2 attach-internet-gateway --internet-gateway-id $IGW --vpc-id $VPC_ID

# 5. Elastic IP + NAT Gateway (for private subnet outbound)
EIP=$(aws ec2 allocate-address --domain vpc --query 'AllocationId' --output text)
NAT=$(aws ec2 create-nat-gateway --subnet-id $PUB_SUBNET \
  --allocation-id $EIP --query 'NatGateway.NatGatewayId' --output text)
echo "Waiting for NAT Gateway..." && sleep 60

# 6. Public Route Table: route 0.0.0.0/0 → IGW
PUB_RT=$(aws ec2 create-route-table --vpc-id $VPC_ID --query 'RouteTable.RouteTableId' --output text)
aws ec2 create-route --route-table-id $PUB_RT --destination-cidr-block 0.0.0.0/0 --gateway-id $IGW
aws ec2 associate-route-table --route-table-id $PUB_RT --subnet-id $PUB_SUBNET

# 7. Private Route Table: route 0.0.0.0/0 → NAT
PRIV_RT=$(aws ec2 create-route-table --vpc-id $VPC_ID --query 'RouteTable.RouteTableId' --output text)
aws ec2 create-route --route-table-id $PRIV_RT --destination-cidr-block 0.0.0.0/0 --nat-gateway-id $NAT
aws ec2 associate-route-table --route-table-id $PRIV_RT --subnet-id $PRIV_SUBNET

echo "VPC Setup Complete!"
echo "Public Subnet: $PUB_SUBNET (has IGW → internet access)"
echo "Private Subnet: $PRIV_SUBNET (has NAT → outbound only)"
```

---

## CC-06: Load Balanced Web Application

```
TECH STACK (from PDF): AWS EC2, ELB

SETUP SCRIPT (alb-setup.sh):
#!/bin/bash

# 1. Launch 2 EC2 instances with web server user data
USER_DATA=$(cat <<'EOF'
#!/bin/bash
yum install httpd -y
systemctl start httpd
echo "<h1>Instance: $(hostname)</h1><p>Served from: $(curl -s http://169.254.169.254/latest/meta-data/local-hostname)</p>" > /var/www/html/index.html
EOF
)

INSTANCE_1=$(aws ec2 run-instances --image-id ami-0c02fb55956c7d316 \
  --instance-type t2.micro --subnet-id $PUB_SUBNET_1 \
  --security-group-ids $WEB_SG --user-data "$USER_DATA" \
  --query 'Instances[0].InstanceId' --output text)
INSTANCE_2=$(aws ec2 run-instances --image-id ami-0c02fb55956c7d316 \
  --instance-type t2.micro --subnet-id $PUB_SUBNET_2 \
  --security-group-ids $WEB_SG --user-data "$USER_DATA" \
  --query 'Instances[0].InstanceId' --output text)

# 2. Create Target Group
TG_ARN=$(aws elbv2 create-target-group \
  --name WebServers-TG --protocol HTTP --port 80 --vpc-id $VPC_ID \
  --health-check-path /index.html --health-check-interval-seconds 30 \
  --query 'TargetGroups[0].TargetGroupArn' --output text)

# 3. Register targets
aws elbv2 register-targets --target-group-arn $TG_ARN \
  --targets Id=$INSTANCE_1 Id=$INSTANCE_2

# 4. Create Application Load Balancer
ALB_ARN=$(aws elbv2 create-load-balancer \
  --name WebApp-ALB --subnets $PUB_SUBNET_1 $PUB_SUBNET_2 \
  --security-groups $ALB_SG \
  --query 'LoadBalancers[0].LoadBalancerArn' --output text)

# 5. Create Listener
aws elbv2 create-listener \
  --load-balancer-arn $ALB_ARN \
  --protocol HTTP --port 80 \
  --default-actions Type=forward,TargetGroupArn=$TG_ARN

# Get ALB DNS
aws elbv2 describe-load-balancers --load-balancer-arns $ALB_ARN \
  --query 'LoadBalancers[0].DNSName' --output text
```

---

## CC-07: Containerized Blog Application (ECS + Docker)

```
TECH STACK (from PDF): AWS ECS, Docker

DOCKERFILE (blog-app/Dockerfile):
FROM nginx:alpine
COPY ./html /usr/share/nginx/html
EXPOSE 80

SETUP GUIDE:
# 1. Build Docker image
docker build -t blog-app ./blog-app/

# 2. Create ECR repository
aws ecr create-repository --repository-name blog-app --region us-east-1
# Output: repositoryUri = ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/blog-app

# 3. Authenticate Docker to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin ACCOUNT.dkr.ecr.us-east-1.amazonaws.com

# 4. Tag and push image
docker tag blog-app:latest ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/blog-app:latest
docker push ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/blog-app:latest

# 5. Create ECS Cluster
aws ecs create-cluster --cluster-name BlogCluster

# 6. Register task definition
aws ecs register-task-definition --cli-input-json file://task-definition.json

# 7. Create ECS Service
aws ecs create-service \
  --cluster BlogCluster \
  --service-name BlogService \
  --task-definition blog-app:1 \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[$SUBNET],
    securityGroups=[$SG],assignPublicIp=ENABLED}"

TASK DEFINITION (task-definition.json):
{
  "family": "blog-app",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256", "memory": "512",
  "executionRoleArn": "arn:aws:iam::ACCOUNT:role/ecsTaskExecutionRole",
  "containerDefinitions": [{
    "name": "blog",
    "image": "ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/blog-app:latest",
    "portMappings": [{"containerPort": 80}],
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": {
        "awslogs-group": "/ecs/blog-app",
        "awslogs-region": "us-east-1",
        "awslogs-stream-prefix": "ecs"
      }
    }
  }]
}
```

---

## CC-08: Serverless Image Resizer

```
TECH STACK (from PDF): AWS Lambda, S3

LAMBDA FUNCTION (lambda_function.py):
import boto3
from PIL import Image
import io

s3 = boto3.client('s3')
OUTPUT_BUCKET = 'resized-images-bucket'
SIZES = {'thumbnail': (150, 150), 'medium': (800, 600), 'large': (1920, 1080)}

def lambda_handler(event, context):
    record = event['Records'][0]['s3']
    source_bucket = record['bucket']['name']
    key = record['object']['key']

    # Skip already-resized images to avoid infinite loop
    if any(key.startswith(size) for size in SIZES):
        return

    response = s3.get_object(Bucket=source_bucket, Key=key)
    image = Image.open(io.BytesIO(response['Body'].read()))
    original_format = image.format or 'JPEG'

    for size_name, dimensions in SIZES.items():
        resized = image.copy()
        resized.thumbnail(dimensions, Image.LANCZOS)
        buffer = io.BytesIO()
        resized.save(buffer, format=original_format)
        buffer.seek(0)
        output_key = f"{size_name}/{key}"
        s3.put_object(Bucket=OUTPUT_BUCKET, Key=output_key, Body=buffer,
                      ContentType=f'image/{original_format.lower()}')
        print(f"Created: s3://{OUTPUT_BUCKET}/{output_key}")
    return {'statusCode': 200, 'resized': list(SIZES.keys())}

SETUP GUIDE:
# 1. Create source bucket
aws s3 mb s3://original-images-source

# 2. Create output bucket
aws s3 mb s3://resized-images-bucket

# 3. Create Lambda with Pillow layer
# Pillow layer ARN (us-east-1): arn:aws:lambda:us-east-1:770693421928:layer:Klayers-p311-Pillow:9
aws lambda create-function --function-name ImageResizer \
  --runtime python3.11 --handler lambda_function.lambda_handler \
  --role arn:aws:iam::ACCOUNT:role/LambdaS3Role \
  --zip-file fileb://lambda.zip \
  --layers arn:aws:lambda:us-east-1:770693421928:layer:Klayers-p311-Pillow:9
  --environment Variables={OUTPUT_BUCKET=resized-images-bucket}

# 4. Add S3 trigger
aws lambda add-permission --function-name ImageResizer \
  --statement-id s3-trigger --action lambda:InvokeFunction \
  --principal s3.amazonaws.com --source-arn arn:aws:s3:::original-images-source

aws s3api put-bucket-notification-configuration \
  --bucket original-images-source \
  --notification-configuration '{
    "LambdaFunctionConfigurations": [{
      "LambdaFunctionArn": "arn:aws:lambda:us-east-1:ACCOUNT:function:ImageResizer",
      "Events": ["s3:ObjectCreated:*"]
    }]
  }'

# 5. Test
aws s3 cp photo.jpg s3://original-images-source/
# Check: aws s3 ls s3://resized-images-bucket/ --recursive
```

---

## CC-09: Serverless Contact Form

```
TECH STACK (from PDF): AWS Lambda, API Gateway (Python)

LAMBDA FUNCTION (lambda_contact.py):
import boto3
import json
import re

ses = boto3.client('ses', region_name='us-east-1')
SENDER = 'verified-sender@yourdomain.com'
RECIPIENT = 'you@yourdomain.com'

def lambda_handler(event, context):
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST'
    }
    if event['httpMethod'] == 'OPTIONS':
        return {'statusCode': 200, 'headers': headers, 'body': ''}

    try:
        body = json.loads(event['body'])
        name = body.get('name', '').strip()
        email = body.get('email', '').strip()
        message = body.get('message', '').strip()

        if not all([name, email, message]):
            return {'statusCode': 400, 'headers': headers,
                    'body': json.dumps({'error': 'All fields required'})}
        if not re.match(r'^[^@]+@[^@]+\.[^@]+$', email):
            return {'statusCode': 400, 'headers': headers,
                    'body': json.dumps({'error': 'Invalid email'})}

        ses.send_email(
            Source=SENDER,
            Destination={'ToAddresses': [RECIPIENT]},
            Message={
                'Subject': {'Data': f'Contact Form: Message from {name}'},
                'Body': {
                    'Html': {'Data': f'<h2>New Contact</h2><p><b>Name:</b> {name}</p><p><b>Email:</b> {email}</p><p><b>Message:</b><br>{message}</p>'}
                }
            },
            ReplyToAddresses=[email]
        )
        return {'statusCode': 200, 'headers': headers,
                'body': json.dumps({'success': True, 'message': 'Email sent!'})}

    except Exception as e:
        return {'statusCode': 500, 'headers': headers,
                'body': json.dumps({'error': str(e)})}

SETUP GUIDE:
# 1. Verify sender email in SES
aws ses verify-email-identity --email-address verified-sender@yourdomain.com
# Check inbox for verification link

# 2. Create Lambda
zip lambda.zip lambda_contact.py
aws lambda create-function --function-name ContactForm \
  --runtime python3.11 --handler lambda_contact.lambda_handler \
  --role arn:aws:iam::ACCOUNT:role/LambdaSESRole \
  --zip-file fileb://lambda.zip \
  --environment Variables={SENDER=verified@yourdomain.com,RECIPIENT=you@yourdomain.com}

# 3. Create REST API in API Gateway
aws apigateway create-rest-api --name ContactFormAPI
# Add POST /contact resource → Lambda integration
# Enable CORS on the resource

# 4. Deploy API
aws apigateway create-deployment --rest-api-id API_ID --stage-name prod

# 5. Update HTML form with API URL
API_URL="https://API_ID.execute-api.us-east-1.amazonaws.com/prod/contact"
```

---

## CC-10: Serverless To-Do List API (Lambda + DynamoDB)

```
TECH STACK (from PDF): AWS Lambda, DynamoDB, API Gateway

LAMBDA FUNCTION (lambda_todos.py):
import boto3
import json
import uuid
from datetime import datetime

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Todos')

def lambda_handler(event, context):
    method = event['httpMethod']
    path_params = event.get('pathParameters') or {}
    cors = {'Access-Control-Allow-Origin': '*'}

    if method == 'GET' and not path_params.get('id'):
        result = table.scan()
        return {'statusCode': 200, 'headers': cors, 'body': json.dumps(result['Items'])}

    elif method == 'POST':
        body = json.loads(event['body'])
        item = {
            'id': str(uuid.uuid4()),
            'text': body['text'],
            'done': False,
            'created_at': datetime.now().isoformat()
        }
        table.put_item(Item=item)
        return {'statusCode': 201, 'headers': cors, 'body': json.dumps(item)}

    elif method == 'PUT':
        item_id = path_params['id']
        body = json.loads(event['body'])
        table.update_item(
            Key={'id': item_id},
            UpdateExpression='SET done = :d, updated_at = :t',
            ExpressionAttributeValues={':d': body['done'],
                                        ':t': datetime.now().isoformat()}
        )
        return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'updated': True})}

    elif method == 'DELETE':
        table.delete_item(Key={'id': path_params['id']})
        return {'statusCode': 204, 'headers': cors, 'body': ''}

SETUP GUIDE:
# 1. Create DynamoDB table
aws dynamodb create-table \
  --table-name Todos \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST

# 2. Create Lambda
aws lambda create-function --function-name TodosAPI \
  --runtime python3.11 --handler lambda_todos.lambda_handler \
  --role arn:aws:iam::ACCOUNT:role/LambdaDynamoRole \
  --zip-file fileb://lambda.zip

# 3. API Gateway routes
# GET    /todos            → Lambda
# POST   /todos            → Lambda
# PUT    /todos/{id}       → Lambda
# DELETE /todos/{id}       → Lambda

# 4. Deploy and test
curl -X POST https://API_URL/todos -d '{"text":"Learn AWS"}' -H "Content-Type: application/json"
curl https://API_URL/todos
```

---

## CC-11: Auto-Scaling Web Application

```
TECH STACK (from PDF): AWS EC2, Auto Scaling

SETUP SCRIPT (autoscaling-setup.sh):
#!/bin/bash

# 1. Create Launch Template
aws ec2 create-launch-template \
  --launch-template-name WebAppLT \
  --version-description "v1" \
  --launch-template-data '{
    "ImageId": "ami-0c02fb55956c7d316",
    "InstanceType": "t2.micro",
    "UserData": "'"$(base64 -w0 user-data.sh)"'",
    "TagSpecifications": [{"ResourceType":"instance","Tags":[{"Key":"Name","Value":"WebApp"}]}]
  }'

# 2. Create Auto Scaling Group
aws autoscaling create-auto-scaling-group \
  --auto-scaling-group-name WebAppASG \
  --launch-template "LaunchTemplateName=WebAppLT,Version=1" \
  --min-size 1 --max-size 5 --desired-capacity 2 \
  --vpc-zone-identifier "$SUBNET_1,$SUBNET_2" \
  --target-group-arns $TG_ARN \
  --health-check-type ELB --health-check-grace-period 60

# 3. Target Tracking Scaling Policy (scale at 70% CPU)
aws autoscaling put-scaling-policy \
  --auto-scaling-group-name WebAppASG \
  --policy-name CPUTargetTracking \
  --policy-type TargetTrackingScaling \
  --target-tracking-configuration '{
    "TargetValue": 70.0,
    "PredefinedMetricSpecification": {
      "PredefinedMetricType": "ASGAverageCPUUtilization"
    },
    "ScaleOutCooldown": 60,
    "ScaleInCooldown": 300
  }'

# 4. Test by generating CPU load (SSH into instance):
# stress --cpu 4 --timeout 300   # requires: sudo yum install stress -y

# 5. Monitor
aws autoscaling describe-auto-scaling-groups --auto-scaling-group-names WebAppASG
aws cloudwatch get-metric-statistics \
  --namespace AWS/EC2 \
  --metric-name CPUUtilization \
  --dimensions Name=AutoScalingGroupName,Value=WebAppASG \
  --start-time $(date -u -v-1H +%Y-%m-%dT%H:%M:%SZ) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%SZ) \
  --period 60 --statistics Average
```

---

## CC-12: Multi-AZ Database Deployment (RDS)

```
TECH STACK (from PDF): AWS RDS

SETUP SCRIPT (rds-setup.sh):
#!/bin/bash

# 1. Create DB Subnet Group (requires subnets in 2+ AZs)
aws rds create-db-subnet-group \
  --db-subnet-group-name MyDBSubnetGroup \
  --db-subnet-group-description "Multi-AZ DB Subnets" \
  --subnet-ids $PRIV_SUBNET_1 $PRIV_SUBNET_2

# 2. Create Multi-AZ RDS MySQL Instance
aws rds create-db-instance \
  --db-instance-identifier mydb-prod \
  --db-instance-class db.t3.micro \
  --engine mysql --engine-version 8.0.35 \
  --master-username admin \
  --master-user-password SecurePass123! \
  --allocated-storage 20 \
  --multi-az \
  --db-subnet-group-name MyDBSubnetGroup \
  --vpc-security-group-ids $DB_SG \
  --backup-retention-period 7 \
  --preferred-backup-window "02:00-03:00" \
  --storage-encrypted \
  --deletion-protection \
  --publicly-accessible false

# 3. Wait for instance to be available
aws rds wait db-instance-available --db-instance-identifier mydb-prod

# 4. Get endpoint
aws rds describe-db-instances \
  --db-instance-identifier mydb-prod \
  --query 'DBInstances[0].Endpoint.Address' --output text

# 5. Create Read Replica (for reporting queries)
aws rds create-db-instance-read-replica \
  --db-instance-identifier mydb-read-replica \
  --source-db-instance-identifier mydb-prod \
  --db-instance-class db.t3.micro

# 6. Test failover (simulates AZ failure)
aws rds reboot-db-instance \
  --db-instance-identifier mydb-prod \
  --force-failover
# Monitor: connection will drop briefly then reconnect to standby (now primary)
```

---

## CC-13: S3 Lifecycle Cost Optimizer

```
TECH STACK (from PDF): AWS S3, Glacier

LIFECYCLE POLICY (lifecycle-policy.json):
{
  "Rules": [
    {
      "ID": "AutoArchiveRule",
      "Status": "Enabled",
      "Filter": {"Prefix": "data/"},
      "Transitions": [
        {"Days": 30, "StorageClass": "STANDARD_IA"},
        {"Days": 90, "StorageClass": "GLACIER"},
        {"Days": 365, "StorageClass": "DEEP_ARCHIVE"}
      ],
      "Expiration": {"Days": 2555},
      "NoncurrentVersionExpiration": {"NoncurrentDays": 30}
    }
  ]
}

SETUP GUIDE:
# 1. Create bucket with versioning
aws s3 mb s3://my-data-archive-2026
aws s3api put-bucket-versioning --bucket my-data-archive-2026 \
  --versioning-configuration Status=Enabled

# 2. Apply lifecycle policy
aws s3api put-bucket-lifecycle-configuration \
  --bucket my-data-archive-2026 \
  --lifecycle-configuration file://lifecycle-policy.json

# 3. Verify policy applied
aws s3api get-bucket-lifecycle-configuration --bucket my-data-archive-2026

# 4. Upload test objects
aws s3 cp large-dataset.csv s3://my-data-archive-2026/data/
# Transition happens automatically after specified days

# 5. Check object storage class
aws s3api head-object --bucket my-data-archive-2026 --key data/large-dataset.csv
# Look for "StorageClass" field in output

COST COMPARISON (per GB/month):
Standard:      $0.023
Standard-IA:   $0.0125 (save 46%)
Glacier:       $0.004  (save 83%)
Deep Archive:  $0.00099 (save 96%)
```

---

## CC-14: EC2 Health Monitoring Dashboard (CloudWatch)

```
TECH STACK (from PDF): AWS EC2, CloudWatch

SETUP GUIDE:
# 1. Create CloudWatch Alarms
# CPU > 80% → send SNS alert
aws cloudwatch put-metric-alarm \
  --alarm-name "HighCPUUtilization" \
  --alarm-description "CPU exceeds 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/EC2 \
  --dimensions Name=InstanceId,Value=i-XXXXXXXXX \
  --period 300 \
  --evaluation-periods 2 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --alarm-actions arn:aws:sns:us-east-1:ACCOUNT:MyAlerts \
  --ok-actions arn:aws:sns:us-east-1:ACCOUNT:MyAlerts

# Status Check Failed alarm
aws cloudwatch put-metric-alarm \
  --alarm-name "EC2StatusCheckFailed" \
  --metric-name StatusCheckFailed \
  --namespace AWS/EC2 \
  --dimensions Name=InstanceId,Value=i-XXXXXXXXX \
  --period 60 --evaluation-periods 3 \
  --threshold 1 \
  --comparison-operator GreaterThanOrEqualToThreshold \
  --alarm-actions arn:aws:sns:us-east-1:ACCOUNT:MyAlerts

# 2. Get metrics via CLI (for building dashboard)
aws cloudwatch get-metric-statistics \
  --namespace AWS/EC2 \
  --metric-name CPUUtilization \
  --dimensions Name=InstanceId,Value=i-XXXXXXXXX \
  --start-time $(date -u -v-1H +%Y-%m-%dT%H:%M:%SZ) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%SZ) \
  --period 300 --statistics Average

# 3. Create CloudWatch Dashboard
aws cloudwatch put-dashboard --dashboard-name MyEC2Dashboard \
  --dashboard-body file://dashboard-config.json

# 4. Create SNS topic for alerts
aws sns create-topic --name EC2Alerts
aws sns subscribe --topic-arn arn:aws:sns:us-east-1:ACCOUNT:EC2Alerts \
  --protocol email --notification-endpoint your@email.com

DEMO UI (HTML + Chart.js):
Simulate real-time metrics dashboard with charts.
In a real setup, fetch data via AWS SDK / CloudWatch API from frontend.
```

---

## CC-15: IAM User Management System

```
TECH STACK (from PDF): AWS IAM

SETUP GUIDE:
# 1. Create User Groups with policies
aws iam create-group --group-name Admins
aws iam create-group --group-name Developers
aws iam create-group --group-name ReadOnly

# Attach AWS managed policies
aws iam attach-group-policy --group-name Admins \
  --policy-arn arn:aws:iam::aws:policy/AdministratorAccess
aws iam attach-group-policy --group-name Developers \
  --policy-arn arn:aws:iam::aws:policy/PowerUserAccess
aws iam attach-group-policy --group-name ReadOnly \
  --policy-arn arn:aws:iam::aws:policy/ReadOnlyAccess

# 2. Create custom developer policy (no IAM changes)
aws iam create-policy --policy-name DeveloperPolicy \
  --policy-document file://developer-policy.json

# 3. Create users and add to groups
for USER in dev-alice dev-bob dev-charlie; do
  aws iam create-user --user-name $USER
  aws iam add-user-to-group --user-name $USER --group-name Developers
  # Create login profile (console access)
  aws iam create-login-profile --user-name $USER --password TempPass123! \
    --password-reset-required
  # Create access keys (programmatic access)
  aws iam create-access-key --user-name $USER
done

# 4. Enable MFA for admin users
# (MFA device must be registered via console or aws iam enable-mfa-device)

# 5. Test permissions
aws iam simulate-principal-policy \
  --policy-source-arn arn:aws:iam::ACCOUNT:user/dev-alice \
  --action-names s3:GetObject ec2:DescribeInstances iam:CreateUser \
  --resource-arns "*"

# 6. Audit: list all users and their groups
aws iam list-users --query 'Users[].UserName' --output table
aws iam list-groups-for-user --user-name dev-alice
```

---

*For the remaining Cloud Computing projects (Static Website with CloudFront,
File Versioning System, VPC Peering, S3 Access Logging, MFA Admin Portal,
EC2 Instance Type Analyzer, Lambda Email Sender, VPC Flow Logs, EC2 Scheduled
Backup, Secure File Upload, Containerized WordPress, Lambda Log Analyzer,
S3 Event Notifications, S3 Bucket Policy Manager, Container Registry with ECR,
Lambda Function Scheduler, Cross-Region Replication) — apply the same
pattern: Python Lambda functions with boto3, AWS CLI commands for setup,
exact service from the PDF tech stack column.*

---

# 📋 MASTER README TEMPLATE

```markdown
# 🎓 Mini Projects Repository
**Chandigarh University | BE-CSE/IT 3rd Year | Jan-June 2026**

## 📚 Subjects
| Subject | Code | Tech Stack | Projects |
|---------|------|------------|----------|
| System Design | 23CSH-314 | Java + Spring Boot + MySQL + REST/WebSocket/Redis | 25 |
| Full Stack Dev-II | 23CSH-309 | React + Redux + Spring Boot + JWT + Docker | 36 |
| Cloud Computing | 23CSH-307 | AWS (EC2/S3/Lambda/VPC/ECS/RDS) + Python/Docker | 36 |

## 🔧 Prerequisites

### For System Design projects:
- Java 17+
- Spring Boot 3.x
- MySQL 8.0
- Redis (for URL Shortener, Caching projects)
- Maven
- RabbitMQ (for Notification System)

### For Full Stack projects:
- Node.js 18+ (for React frontend)
- Java 17+ (for Spring Boot backend)
- MySQL 8.0
- Docker + Docker Compose
- Git

### For Cloud Computing projects:
- AWS Account (Free Tier sufficient)
- AWS CLI configured: aws configure
- Python 3.11+ with boto3: pip install boto3
- Docker (for ECS projects)

## 🚀 Quick Start (Full Stack)
cd full-stack/college-management-portal
docker-compose up --build
# Backend: http://localhost:8080
# Frontend: http://localhost:3000

## 🚀 Quick Start (System Design)
cd system-design/movie-ticket-booking/backend
mvn spring-boot:run
# API: http://localhost:8080/api/

## 🚀 Quick Start (Cloud)
cd cloud-computing/ec2-auto-stop/aws-setup
chmod +x setup-guide.sh && ./setup-guide.sh
```