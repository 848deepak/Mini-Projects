package com.miniproject.employeeattendancepayroll.repository;

import com.miniproject.employeeattendancepayroll.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
}
