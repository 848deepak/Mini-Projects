# How to Implement: Multi-AZ Database (RDS)

This guide walks you through setting up an Amazon Relational Database Service (RDS) instance that automatically replicates data to a standby instance in a different Availability Zone. This ensures High Availability (HA) and automatic failover in case of hardware failure or AZ outage.

## Prerequisites
- An active AWS Account.
- Ensure you have a VPC with at least two subnets in different Availability Zones (like our `vpc-public-private-arch` project).

## Step 1: Subnet Group Creation
1. Go to the **RDS Dashboard** in the AWS Console.
2. In the left-hand navigation pane, click **Subnet groups**.
3. Click **Create DB subnet group**.
4. Name your group (e.g., `multi-az-db-subnet-group`), provide a description.
5. Select your VPC.
6. Under Add subnets, select at least two Availability Zones and their corresponding *Private* subnets.
7. Click **Create**.

## Step 2: Create the RDS Database
1. Go back to the **RDS Dashboard** and click **Create database**.
2. **Choose a database creation method**: Select `Standard create`.
3. **Engine options**: Choose `MySQL`, `PostgreSQL`, or `MariaDB`.
4. **Templates**: Select `Production` (this is important, as Dev/Test defaults might turn off Multi-AZ).
5. **Availability and durability**: 
   - Under Multi-AZ deployment, select **Create a standby instance (recommended for production availability)**.
6. **Settings**:
   - Master username: Set an admin name (e.g., `dbadmin`).
   - Master password: Enter a strong password.
7. **Instance configuration**: Choose a burstable class like `db.t3.micro` if you are just testing to minimize costs.
8. **Storage**: Leave defaults (e.g., 20 GB gp2 or gp3).
9. **Connectivity**:
   - Virtual private cloud (VPC): Select your custom VPC.
   - DB Subnet group: Select the one you made in Step 1.
   - Public access: Select **No** (best security practice).
   - VPC security group: Create a new VPC security group or select an existing one that allows MySQL/PostgreSQL traffic from your Web Server/Lambda subnets.
10. Click **Create database**. (Note: Provisioning a Multi-AZ database takes several minutes).

## Step 3: Verification / Simulating Failover
1. Once the database status is `Available`, click on your Database identifier.
2. Go to the **Actions** dropdown menu.
3. Click **Reboot**.
4. Check the box that says **Reboot with failover**.
5. Click **Confirm**.
6. Observe the Events section. You will see RDS automatically shutting down the primary instance, promoting the secondary standby instance to primary in the other AZ, and repointing the DNS CNAME to the new primary. During this short window, the DB is unreachable, but recovers automatically without any manual connection string changes.
