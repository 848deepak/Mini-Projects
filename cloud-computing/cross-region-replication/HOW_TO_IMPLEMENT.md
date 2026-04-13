# How to Implement: Cross-Region Replication (S3)

This guide walks you through configuring an S3 bucket to automatically replicate uploaded objects to a bucket in another region, which is essential for Disaster Recovery.

## Prerequisites
- AWS Account access.

## Step 1: Create the Source Bucket
1. Go to the **Amazon S3** console.
2. Click **Create bucket**.
3. Name it e.g., `source-dr-bucket-12345` (must be globally unique).
4. Region: Choose `us-east-1` (N. Virginia).
5. **CRITICAL**: Under Bucket Versioning, select **Enable**. (CRR requires versioning).
6. Click **Create bucket**.

## Step 2: Create the Destination Bucket
1. Click **Create bucket** again.
2. Name it e.g., `destination-dr-bucket-12345`.
3. Region: Choose a *different* region e.g., `us-west-2` (Oregon).
4. **CRITICAL**: Under Bucket Versioning, select **Enable**.
5. Click **Create bucket**.

## Step 3: Create the Replication Rule
1. Open the source bucket (`source-dr-bucket-12345`).
2. Navigate to the **Management** tab.
3. Scroll down to **Replication rules** and click **Create replication rule**.
4. **Rule name**: `ReplicateToDR`
5. **Status**: Enabled.
6. **Priority**: 1 (leave as default).
7. **Rule scope**: `Apply to all objects in the bucket`.
8. **Destination**:
   - Choose `Specify a bucket in this account`.
   - Browse and select your destination bucket (`destination-dr-bucket-12345`).
9. **IAM role**: Choose `Create new role` (AWS will automatically create an IAM role with the correct read/write permissions for replication).
10. **Optional Settings**: You can choose to replicate Delete markers or change the storage class of the replica if desired.
11. Click **Save**.
12. A prompt might ask if you want to replicate *existing* objects. Choose "No, do not replicate existing objects" for simplicity (existing object replication requires a one-time Batch Operations job).

## Step 4: Verification
1. Open your source bucket and upload an image or text file.
2. Wait a few minutes (CRR can take a moment depending on the file size and region).
3. Navigate to your destination bucket in `us-west-2`.
4. You should see the exact replica of your file present!
