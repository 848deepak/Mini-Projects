# How to Implement: VPC Public and Private Architecture

This guide explains how to manually set up a custom VPC with a public and private subnet using the AWS Console.

## Prerequisites
- An active AWS Account with Administrator access.

## Step 1: Create the VPC
1. Navigate to the **VPC Dashboard** in the AWS Console.
2. Click **Create VPC**.
3. Select **VPC only**.
4. Name tag: `my-custom-vpc`.
5. IPv4 CIDR block: `10.0.0.0/16`.
6. Click **Create VPC**.

## Step 2: Create Subnets
1. In the left navigation, click **Subnets**, then **Create subnet**.
2. Select your newly created `my-custom-vpc`.
3. **Public Subnet:**
   - Name: `public-subnet`
   - Availability Zone: (Choose the first one, e.g., `us-east-1a`)
   - IPv4 CIDR block: `10.0.1.0/24`
4. Click **Add new subnet** (for the private one):
   - Name: `private-subnet`
   - Availability Zone: (Choose a different one, e.g., `us-east-1b`)
   - IPv4 CIDR block: `10.0.2.0/24`
5. Click **Create subnet**.

## Step 3: Internet Gateway (IGW)
1. Navigate to **Internet Gateways** and click **Create internet gateway**.
2. Name it `my-igw` and create it.
3. Select it, click **Actions**, and choose **Attach to VPC**. Select `my-custom-vpc`.

## Step 4: NAT Gateway (Optional but Recommended for Private Outbound)
1. Navigate to **NAT Gateways** and click **Create NAT gateway**.
2. Name it `my-nat-gw`.
3. Select the `public-subnet`.
4. Click **Allocate Elastic IP**.
5. Click **Create NAT gateway**. (Wait a few minutes for it to become available).

## Step 5: Route Tables (RT)
1. Navigate to **Route tables** and find the main route table generated for your VPC. Rename it to `private-rt`.
2. Click **Create route table**. Name it `public-rt` and select your VPC. Click create.
3. Select `public-rt`, go to the **Routes** tab, and click **Edit routes**:
   - Add route: `0.0.0.0/0`, Target: Internet Gateway (`my-igw`).
   - Save changes.
4. Go to **Subnet associations** for `public-rt` and associate it with the `public-subnet`.
5. *For the private subnet:* (If you created a NAT Gateway)
   - Select `private-rt`, edit routes.
   - Add route: `0.0.0.0/0`, Target: NAT Gateway (`my-nat-gw`).
   - Ensure it is associated with `private-subnet`.

## Architecture Complete!
You now have a 2-tier networking architecture. Web servers go into the public subnet and databases into the private subnet.
