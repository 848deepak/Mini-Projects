package com.miniproject.assetresourcemanagement.repository;

import com.miniproject.assetresourcemanagement.model.Asset;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AssetRepository extends JpaRepository<Asset, Long> {
}
