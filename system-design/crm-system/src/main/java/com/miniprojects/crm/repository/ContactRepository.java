package com.miniprojects.crm.repository;

import com.miniprojects.crm.model.Contact;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactRepository extends JpaRepository<Contact, String> {}
