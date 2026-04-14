package com.miniprojects.crm.api.dto;

import com.miniprojects.crm.model.LeadStatus;

public record CreateLeadResponse(String leadId, LeadStatus status, int score) {}
