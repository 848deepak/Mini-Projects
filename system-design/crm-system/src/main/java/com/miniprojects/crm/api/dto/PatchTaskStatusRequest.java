package com.miniprojects.crm.api.dto;

import com.miniprojects.crm.model.TaskStatus;
import jakarta.validation.constraints.NotNull;

public record PatchTaskStatusRequest(@NotNull TaskStatus status) {}
