package com.miniprojects.crm.service;

import com.miniprojects.crm.api.dto.ConvertLeadRequest;
import com.miniprojects.crm.api.dto.ConvertLeadResponse;
import com.miniprojects.crm.api.dto.CreateInteractionRequest;
import com.miniprojects.crm.api.dto.CreateLeadRequest;
import com.miniprojects.crm.api.dto.CreateLeadResponse;
import com.miniprojects.crm.api.dto.CreateTaskRequest;
import com.miniprojects.crm.api.dto.PatchOpportunityStageRequest;
import com.miniprojects.crm.api.dto.QualifyLeadRequest;
import com.miniprojects.crm.model.Account;
import com.miniprojects.crm.model.Contact;
import com.miniprojects.crm.model.CrmTask;
import com.miniprojects.crm.model.IdempotencyRecord;
import com.miniprojects.crm.model.Interaction;
import com.miniprojects.crm.model.Lead;
import com.miniprojects.crm.model.LeadStatus;
import com.miniprojects.crm.model.Opportunity;
import com.miniprojects.crm.model.OpportunityStage;
import com.miniprojects.crm.model.TaskStatus;
import com.miniprojects.crm.repository.AccountRepository;
import com.miniprojects.crm.repository.ContactRepository;
import com.miniprojects.crm.repository.CrmTaskRepository;
import com.miniprojects.crm.repository.IdempotencyRecordRepository;
import com.miniprojects.crm.repository.InteractionRepository;
import com.miniprojects.crm.repository.LeadRepository;
import com.miniprojects.crm.repository.OpportunityRepository;
import jakarta.persistence.EntityNotFoundException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Month;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CrmService {

    private final LeadRepository leadRepository;
    private final AccountRepository accountRepository;
    private final ContactRepository contactRepository;
    private final OpportunityRepository opportunityRepository;
    private final InteractionRepository interactionRepository;
    private final CrmTaskRepository crmTaskRepository;
    private final IdempotencyRecordRepository idempotencyRecordRepository;

    public CrmService(
        LeadRepository leadRepository,
        AccountRepository accountRepository,
        ContactRepository contactRepository,
        OpportunityRepository opportunityRepository,
        InteractionRepository interactionRepository,
        CrmTaskRepository crmTaskRepository,
        IdempotencyRecordRepository idempotencyRecordRepository
    ) {
        this.leadRepository = leadRepository;
        this.accountRepository = accountRepository;
        this.contactRepository = contactRepository;
        this.opportunityRepository = opportunityRepository;
        this.interactionRepository = interactionRepository;
        this.crmTaskRepository = crmTaskRepository;
        this.idempotencyRecordRepository = idempotencyRecordRepository;
    }

    @Transactional
    public CreateLeadResponse createLead(CreateLeadRequest request) {
        String ref = resolveIdempotentRef(request.idempotencyKey());
        if (ref != null) {
            Lead existing = leadRepository.findById(ref)
                .orElseThrow(() -> new EntityNotFoundException("Idempotent lead record missing"));
            return new CreateLeadResponse(existing.getId(), existing.getStatus(), existing.getScore());
        }

        leadRepository.findByEmailIgnoreCase(request.email()).ifPresent(existing -> {
            throw new IllegalArgumentException("Lead already exists for this email");
        });

        Lead lead = new Lead();
        lead.setSource(request.source());
        lead.setFullName(request.fullName());
        lead.setEmail(request.email());
        lead.setPhone(request.phone());
        lead.setOwnerUserId(request.ownerUserId());
        lead.setScore(computeLeadScore(request.source(), request.email()));
        lead.setStatus(LeadStatus.NEW);

        Lead saved = leadRepository.save(lead);
        recordIdempotency(request.idempotencyKey(), saved.getId());
        return new CreateLeadResponse(saved.getId(), saved.getStatus(), saved.getScore());
    }

    @Transactional
    public Lead qualifyLead(String leadId, QualifyLeadRequest request) {
        Lead lead = leadRepository.findById(leadId)
            .orElseThrow(() -> new EntityNotFoundException("Lead not found"));
        if (lead.getStatus() == LeadStatus.CONVERTED) {
            throw new IllegalArgumentException("Converted lead cannot be re-qualified");
        }
        if (request.decision() != LeadStatus.QUALIFIED && request.decision() != LeadStatus.REJECTED) {
            throw new IllegalArgumentException("Decision must be QUALIFIED or REJECTED");
        }
        lead.setQualificationNotes(request.qualificationNotes());
        lead.setStatus(request.decision());
        return leadRepository.save(lead);
    }

    @Transactional
    public ConvertLeadResponse convertLead(String leadId, ConvertLeadRequest request) {
        String ref = resolveIdempotentRef(request.idempotencyKey());
        if (ref != null) {
            String[] parts = ref.split("\\|");
            if (parts.length == 3) {
                return new ConvertLeadResponse(parts[0], parts[1], parts[2]);
            }
        }

        Lead lead = leadRepository.findById(leadId)
            .orElseThrow(() -> new EntityNotFoundException("Lead not found"));
        if (lead.getStatus() != LeadStatus.QUALIFIED) {
            throw new IllegalArgumentException("Only QUALIFIED leads can be converted");
        }

        Account account = new Account();
        account.setName(request.accountName());
        account.setIndustry(request.industry());
        account.setOwnerUserId(lead.getOwnerUserId());
        Account savedAccount = accountRepository.save(account);

        Contact contact = new Contact();
        contact.setAccountId(savedAccount.getId());
        contact.setFullName(lead.getFullName());
        contact.setEmail(lead.getEmail());
        contact.setPhone(lead.getPhone());
        Contact savedContact = contactRepository.save(contact);

        Opportunity opportunity = new Opportunity();
        opportunity.setAccountId(savedAccount.getId());
        opportunity.setName(request.opportunityName());
        opportunity.setStage(OpportunityStage.QUALIFICATION);
        opportunity.setAmount(request.opportunityAmount());
        opportunity.setProbability(request.probability());
        opportunity.setExpectedCloseDate(request.expectedCloseDate());
        opportunity.setOwnerUserId(lead.getOwnerUserId());
        Opportunity savedOpportunity = opportunityRepository.save(opportunity);

        lead.setStatus(LeadStatus.CONVERTED);
        leadRepository.save(lead);

        String responseRef = savedAccount.getId() + "|" + savedContact.getId() + "|" + savedOpportunity.getId();
        recordIdempotency(request.idempotencyKey(), responseRef);
        return new ConvertLeadResponse(savedAccount.getId(), savedContact.getId(), savedOpportunity.getId());
    }

    @Transactional(readOnly = true)
    public List<Opportunity> listOpportunities(
        OpportunityStage stage,
        String owner,
        LocalDate from,
        LocalDate to
    ) {
        if (stage != null && owner != null && from != null && to != null) {
            return opportunityRepository.findByStageAndOwnerUserIdAndExpectedCloseDateBetween(stage, owner, from, to);
        }
        LocalDate safeFrom = from == null ? LocalDate.now().minusMonths(12) : from;
        LocalDate safeTo = to == null ? LocalDate.now().plusMonths(12) : to;
        return opportunityRepository.findByExpectedCloseDateBetween(safeFrom, safeTo);
    }

    @Transactional
    public Opportunity patchOpportunityStage(String opportunityId, PatchOpportunityStageRequest request) {
        if (resolveIdempotentRef(request.idempotencyKey()) != null) {
            return opportunityRepository.findById(opportunityId)
                .orElseThrow(() -> new EntityNotFoundException("Opportunity not found"));
        }

        Opportunity opportunity = opportunityRepository.findById(opportunityId)
            .orElseThrow(() -> new EntityNotFoundException("Opportunity not found"));
        if (opportunity.getVersion() != request.version()) {
            throw new IllegalArgumentException("Version mismatch. Refresh and retry.");
        }
        if (opportunity.getStage() != request.fromStage()) {
            throw new IllegalArgumentException("Invalid fromStage for current opportunity state");
        }
        opportunity.setStage(request.toStage());
        Opportunity saved = opportunityRepository.save(opportunity);
        recordIdempotency(request.idempotencyKey(), saved.getId());
        return saved;
    }

    @Transactional
    public Interaction createInteraction(CreateInteractionRequest request) {
        Interaction interaction = new Interaction();
        interaction.setEntityType(request.entityType());
        interaction.setEntityId(request.entityId());
        interaction.setChannel(request.channel());
        interaction.setSubject(request.subject());
        interaction.setNotes(request.notes());
        interaction.setOccurredAt(request.occurredAt());
        return interactionRepository.save(interaction);
    }

    @Transactional
    public CrmTask createTask(CreateTaskRequest request) {
        CrmTask task = new CrmTask();
        task.setEntityType(request.entityType());
        task.setEntityId(request.entityId());
        task.setDueAt(request.dueAt());
        task.setPriority(request.priority());
        task.setAssigneeUserId(request.assigneeUserId());
        task.setStatus(TaskStatus.OPEN);
        return crmTaskRepository.save(task);
    }

    @Transactional
    public CrmTask patchTaskStatus(String taskId, TaskStatus status) {
        CrmTask task = crmTaskRepository.findById(taskId)
            .orElseThrow(() -> new EntityNotFoundException("Task not found"));
        task.setStatus(status);
        return crmTaskRepository.save(task);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> funnelReport() {
        long prospect = opportunityRepository.findAll().stream().filter(o -> o.getStage() == OpportunityStage.PROSPECT).count();
        long qualification = opportunityRepository.findAll().stream().filter(o -> o.getStage() == OpportunityStage.QUALIFICATION).count();
        long proposal = opportunityRepository.findAll().stream().filter(o -> o.getStage() == OpportunityStage.PROPOSAL).count();
        long negotiation = opportunityRepository.findAll().stream().filter(o -> o.getStage() == OpportunityStage.NEGOTIATION).count();
        long closedWon = opportunityRepository.findAll().stream().filter(o -> o.getStage() == OpportunityStage.CLOSED_WON).count();
        return Map.of(
            "prospect", prospect,
            "qualification", qualification,
            "proposal", proposal,
            "negotiation", negotiation,
            "closedWon", closedWon
        );
    }

    @Transactional(readOnly = true)
    public Map<String, Object> forecastReport(String quarter) {
        LocalDate start = quarterStart(quarter);
        LocalDate end = start.plusMonths(3).minusDays(1);
        List<Opportunity> opportunities = opportunityRepository.findByExpectedCloseDateBetween(start, end);
        BigDecimal weighted = opportunities.stream()
            .map(o -> o.getAmount().multiply(BigDecimal.valueOf(o.getProbability() / 100.0)))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal total = opportunities.stream().map(Opportunity::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);

        return Map.of(
            "quarter", quarter,
            "opportunityCount", opportunities.size(),
            "totalPipeline", total,
            "weightedForecast", weighted
        );
    }

    private int computeLeadScore(String source, String email) {
        int score = 40;
        if ("referral".equalsIgnoreCase(source)) {
            score += 25;
        }
        if (email.toLowerCase().contains(".edu") || email.toLowerCase().contains(".org")) {
            score += 10;
        }
        return Math.min(score, 100);
    }

    private String resolveIdempotentRef(String key) {
        return idempotencyRecordRepository.findByKeyValue(key).map(IdempotencyRecord::getResponseRef).orElse(null);
    }

    private void recordIdempotency(String key, String responseRef) {
        IdempotencyRecord record = new IdempotencyRecord();
        record.setKeyValue(key);
        record.setResponseRef(responseRef);
        idempotencyRecordRepository.save(record);
    }

    private LocalDate quarterStart(String quarter) {
        if (quarter == null || !quarter.matches("\\d{4}-Q[1-4]")) {
            return LocalDate.of(LocalDate.now().getYear(), Month.JANUARY, 1);
        }
        int year = Integer.parseInt(quarter.substring(0, 4));
        int q = Integer.parseInt(quarter.substring(6));
        int month = switch (q) {
            case 1 -> 1;
            case 2 -> 4;
            case 3 -> 7;
            default -> 10;
        };
        return LocalDate.of(year, month, 1);
    }
}
