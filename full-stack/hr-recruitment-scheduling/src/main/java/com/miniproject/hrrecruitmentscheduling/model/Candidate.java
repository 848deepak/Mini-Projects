package com.miniproject.hrrecruitmentscheduling.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
public class Candidate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Candidate name required")
    private String name;

    @Email
    @NotBlank(message = "Email required")
    private String email;

    @NotBlank(message = "Role applied required")
    private String roleApplied;

    private LocalDate interviewDate;
    private LocalTime interviewTime;

    private String status = "Applied"; // Applied, Interview Scheduled, Offered, Rejected

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getRoleApplied() { return roleApplied; }
    public void setRoleApplied(String roleApplied) { this.roleApplied = roleApplied; }
    public LocalDate getInterviewDate() { return interviewDate; }
    public void setInterviewDate(LocalDate interviewDate) { this.interviewDate = interviewDate; }
    public LocalTime getInterviewTime() { return interviewTime; }
    public void setInterviewTime(LocalTime interviewTime) { this.interviewTime = interviewTime; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
