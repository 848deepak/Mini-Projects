package com.cabfleet.config;

import com.cabfleet.entity.*;
import com.cabfleet.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.time.Instant;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final DriverRepository driverRepository;
    private final VehicleRepository vehicleRepository;
    private final DriverPresenceRepository presenceRepository;
    private final DriverShiftRepository shiftRepository;

    // Bangalore city center area lat/lon cluster
    private static final double[][] LOCATIONS = {
        {12.9716, 77.5946},  // Bangalore center
        {12.9352, 77.6245},  // Koramangala
        {12.9783, 77.6408},  // Indiranagar
        {12.9279, 77.6272},  // BTM Layout
        {13.0012, 77.5900},  // Rajajinagar
        {12.9200, 77.6800},  // HSR Layout
        {12.9587, 77.7081},  // Whitefield entry
        {13.0200, 77.5800},  // Yeshwanthpur
        {12.9500, 77.5700},  // Jayanagar
        {12.9100, 77.6100},  // Electronic City exit
    };

    private static final String[] NAMES = {
        "Ravi Kumar", "Suresh Patil", "Mahesh Reddy", "Arun Sharma",
        "Vijay Nair", "Kiran Bhat", "Sanjay Gupta", "Pradeep Hegde",
        "Lokesh Rao", "Ganesh Iyer"
    };

    private static final String[][] VEHICLES = {
        {"MH12AB1234", "MINI",    "Swift", "White"},
        {"KA01CD5678", "SEDAN",   "Honda City", "Silver"},
        {"KA03EF9012", "SUV",     "Innova", "Grey"},
        {"DL08GH3456", "MINI",    "WagonR", "Red"},
        {"TN09IJ7890", "PREMIUM", "Mercedes E-Class", "Black"},
        {"KA04KL1234", "MINI",    "Alto", "Blue"},
        {"KA05MN5678", "SEDAN",   "Hyundai Verna", "White"},
        {"KA06OP9012", "AUTO",    "Bajaj RE", "Yellow"},
        {"KA07QR3456", "MINI",    "Baleno", "Silver"},
        {"KA08ST7890", "SUV",     "Scorpio", "Black"},
    };

    @Override
    public void run(String... args) {
        if (driverRepository.count() > 0) return; // already seeded

        log.info("Seeding demo data...");

        for (int i = 0; i < 10; i++) {
            final int idx = i;

            Driver driver = Driver.builder()
                    .name(NAMES[i])
                    .phone("+9198765432" + String.format("%02d", i))
                    .email("driver" + i + "@cabfleet.demo")
                    .password("demo123")
                    .cityId("BLR")
                    .rating(4.0 + (Math.random() * 1.0))
                    .verificationStatus(Driver.VerificationStatus.VERIFIED)
                    .currentStatus(i < 6 ? Driver.DriverStatus.IDLE : Driver.DriverStatus.OFFLINE)
                    .createdAt(Instant.now())
                    .build();
            driverRepository.save(driver);

            Vehicle vehicle = Vehicle.builder()
                    .driverId(driver.getDriverId())
                    .plateNo(VEHICLES[i][0])
                    .type(Vehicle.VehicleType.valueOf(VEHICLES[i][1]))
                    .model(VEHICLES[i][2])
                    .color(VEHICLES[i][3])
                    .capacity(4)
                    .status(Vehicle.VehicleStatus.ACTIVE)
                    .year(2020 + (i % 4))
                    .build();
            vehicleRepository.save(vehicle);

            if (i < 6) {
                // IDLE drivers have live presence
                DriverPresence presence = DriverPresence.builder()
                        .driverId(driver.getDriverId())
                        .lat(LOCATIONS[i][0] + (Math.random() - 0.5) * 0.01)
                        .lon(LOCATIONS[i][1] + (Math.random() - 0.5) * 0.01)
                        .heading(Math.random() * 360)
                        .speed(0.0)
                        .status(Driver.DriverStatus.IDLE)
                        .lastSeenAt(Instant.now())
                        .build();
                presenceRepository.save(presence);

                DriverShift shift = DriverShift.builder()
                        .driverId(driver.getDriverId())
                        .vehicleId(vehicle.getVehicleId())
                        .startAt(Instant.now().minusSeconds(3600L * (i + 1)))
                        .state(DriverShift.ShiftState.ACTIVE)
                        .build();
                shiftRepository.save(shift);
            }
        }

        log.info("✅ Seeded 10 drivers (6 IDLE, 4 OFFLINE) with vehicles and presence data for city BLR");
    }
}
