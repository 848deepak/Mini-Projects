# How to Implement: S3 Lifecycle Optimizer

This guide details how to create an Amazon S3 lifecycle rule to automatically transition data between different storage classes over time, significantly reducing AWS storage costs.

## Prerequisites
- An active AWS Account.

## Step 1: Create an S3 Bucket (If needed)
1. Navigate to the **S3 Console**.
2. Create a bucket (e.g., `lifecycle-test-logs-bucket`).
3. You can enable versioning if you want lifecycle rules to apply to previous versions as well, though it's optional.

## Step 2: Create the Lifecycle Rule
1. Click on your newly created bucket (or an existing one).
2. Go to the **Management** tab.
3. Scroll down to **Lifecycle rules** and click **Create lifecycle rule**.
4. **Lifecycle rule name**: `ArchiveOldLogs`
5. **Choose a rule scope**:
   - If you want it for specific folders (e.g., logs), choose `Limit the scope of this rule using one or more filters` and type a Prefix like `logs/`.
   - Otherwise, select `Apply to all objects in the bucket`.
6. **Lifecycle rule actions**: check the boxes for:
   - `Move current versions of objects between storage classes`
   - `Expire current versions of objects` (Optional, if you want AWS to auto-delete them eventually).

## Step 3: Define Transition Rules
1. Under the **Transition current versions of objects between storage classes** section:
2. **First transition**:
   - Storage class transitions: Choose **Standard-IA** (Infrequent Access).
   - Days after object creation: `30` 
     *(Explanation: AWS charges you less per GB for Standard-IA, but more for access. After 30 days, files are rarely accessed.)*
3. **Second transition**:
   - Click **Add transition**.
   - Storage class transitions: Choose **Glacier Flexible Retrieval**.
   - Days after object creation: `90`
     *(Explanation: At 90 days, the files are almost entirely dead, but kept for compliance. Glacier is extremely cheap.)*

## Step 4: Define Expiration (Optional)
If you never need the files after a certain time (e.g. 1 year / 365 days):
1. Scroll to the **Expire current versions of objects** section.
2. Days after object creation: `365`

## Step 5: Review and Save
1. Review the summary timeline chart AWS provides at the bottom. It visually confirms your objects flow:
   - Day 0: S3 Standard
   - Day 30: S3 Standard-IA
   - Day 90: Glacier Flexible Retrieval
   - Day 365: Object Deleted
2. Click **Create rule**.

## Verification
AWS automatically runs a background process to evaluate lifecycle policies daily at midnight UTC. Since we cannot manually trigger it or speed up time, verification relies on reviewing the rule configuration using the Timeline graph in the Management tab to ensure it accurately reflects your desired storage strategy.
