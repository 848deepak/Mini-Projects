# How to Implement: IAM User Management

This guide explains how to set up robust Identity and Access Management (IAM) applying the Principle of Least Privilege. We will create three distinct Groups (Admin, Developer, and Read-Only), set up a user, and enforce MFA.

## Prerequisites
- Logged in as the Root OS user or an existing Administrator in AWS.

## Step 1: Create IAM Groups
1. Go to the **IAM Dashboard** in the AWS Console.
2. In the left navigation, click **User groups**.
3. Click **Create group**.

**Group 1: Admins**
- User group name: `Admins`
- Attach permissions policies: Search for and select `AdministratorAccess`.
- Click **Create group**.

**Group 2: Developers**
- Click **Create group**.
- User group name: `Developers`
- Attach permissions policies: Search for and select `PowerUserAccess` (provides full access to AWS services like EC2, S3, RDS, but *denies* access to change IAM permissions).
- Click **Create group**.

**Group 3: Read-Only**
- Click **Create group**.
- User group name: `ReadOnlyAccess`
- Attach permissions policies: Search for and select `ViewOnlyAccess` or `ReadOnlyAccess`.
- Click **Create group**.

## Step 2: Enforcing MFA (Multi-Factor Authentication)
It is highly recommended that you enforce MFA for all users.
1. In the IAM dashboard, navigate to **Policies**.
2. Click **Create policy**.
3. Go to the **JSON** tab and paste a standard AWS template for enforcing MFA (you can find "Force_MFA" policy templates in AWS documentation). E.g.:
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowViewAccountInfo",
            "Effect": "Allow",
            "Action": "iam:ListVirtualMFADevices",
            "Resource": "*"
        },
        {
            "Sid": "AllowManageOwnPasswords",
            ...
```
4. Attach this policy to your `Developers` and `Admins` groups.

## Step 3: Create an IAM User
1. Click **Users** in the left navigation.
2. Click **Add users**.
3. User name: `alice.dev`.
4. Check **Provide user access to the AWS Management Console**. Select **I want to create an IAM user**.
5. Console password: Auto-generated password.
6. Check **Users must create a new password at next sign-in**.
7. Click Next.

## Step 4: Assign User to Group
1. Under Permissions options, select **Add user to group**.
2. Select the `Developers` group.
3. Click Next, review, and click **Create user**.
4. Download the CSV containing Alice's login URL, username, and initial password.

## Verification
1. Have Alice log into the AWS console using the provided URL.
2. She will be forced to change her password immediately.
3. Once in, let her try to navigate to IAM and create a user. It should fail (`AccessDenied`) because she is a PowerUser, not an Admin.
4. Let her navigate to EC2, she should be able to see and launch instances.
