package com.miniprojects.crm.api;

import com.miniprojects.crm.api.dto.ConvertLeadRequest;
import com.miniprojects.crm.api.dto.ConvertLeadResponse;
import com.miniprojects.crm.api.dto.CreateInteractionRequest;
import com.miniprojects.crm.api.dto.CreateLeadRequest;
import com.miniprojects.crm.api.dto.CreateLeadResponse;
import com.miniprojects.crm.api.dto.CreateTaskRequest;
import com.miniprojects.crm.api.dto.PatchOpportunityStageRequest;
import com.miniprojects.crm.api.dto.PatchTaskStatusRequest;
import com.miniprojects.crm.api.dto.QualifyLeadRequest;
import com.miniprojects.crm.model.CrmTask;
import com.miniprojects.crm.model.Interaction;
import com.miniprojects.crm.model.Lead;
import com.miniprojects.crm.model.Opportunity;
import com.miniprojects.crm.model.OpportunityStage;
import com.miniprojects.crm.service.CrmService;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class CrmController {

    private final CrmService crmService;

    public CrmController(CrmService crmService) {
        this.crmService = crmService;
    }

    @PostMapping("/leads")
    @ResponseStatus(HttpStatus.CREATED)
    public CreateLeadResponse createLead(@Valid @RequestBody CreateLeadRequest request) {
        return crmService.createLead(request);
    }

    @PostMapping("/leads/{leadId}/qualify")
    public Lead qualifyLead(@PathVariable String leadId, @Valid @RequestBody QualifyLeadRequest request) {
        return crmService.qualifyLead(leadId, request);
    }

    @PostMapping("/leads/{leadId}/convert")
    public ConvertLeadResponse convertLead(@PathVariable String leadId, @Valid @RequestBody ConvertLeadRequest request) {
        return crmService.convertLead(leadId, request);
    }

    @GetMapping("/opportunities")
    public List<Opportunity> listOpportunities(
        @RequestParam(required = false) OpportunityStage stage,
        @RequestParam(required = false) String owner,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
    ) {
        return crmService.listOpportunities(stage, owner, from, to);
    }

    @PatchMapping("/opportunities/{opportunityId}/stage")
    public Opportunity patchOpportunityStage(
        @PathVariable String opportunityId,
        @Valid @RequestBody PatchOpportunityStageRequest request
    ) {
        return crmService.patchOpportunityStage(opportunityId, request);
    }

    @PostMapping("/interactions")
    @ResponseStatus(HttpStatus.CREATED)
    public Interaction createInteraction(@Valid @RequestBody CreateInteractionRequest request) {
        return crmService.createInteraction(request);
    }

    @PostMapping("/tasks")
    @ResponseStatus(HttpStatus.CREATED)
    public CrmTask createTask(@Valid @RequestBody CreateTaskRequest request) {
        return crmService.createTask(request);
    }

    @PatchMapping("/tasks/{taskId}/status")
    public CrmTask patchTaskStatus(@PathVariable String taskId, @Valid @RequestBody PatchTaskStatusRequest request) {
        return crmService.patchTaskStatus(taskId, request.status());
    }

    @GetMapping("/reports/funnel")
    public Map<String, Object> funnelReport() {
        return crmService.funnelReport();
    }

    @GetMapping("/reports/forecast")
    public Map<String, Object> forecastReport(@RequestParam(defaultValue = "2026-Q2") String quarter) {
        return crmService.forecastReport(quarter);
    }
}
