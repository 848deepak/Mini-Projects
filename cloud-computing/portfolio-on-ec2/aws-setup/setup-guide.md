# AWS EC2 Setup Guide: Personal Portfolio

This guide outlines the exact AWS CLI commands and steps required to launch an EC2 instance, install Apache, and deploy the portfolio website.

## 1. Launch EC2 t2.micro Instance

We will launch an EC2 instance using the Amazon Linux 2023 AMI. Make sure you have your AWS CLI configured and your key pair ready.

```bash
aws ec2 run-instances \
    --image-id ami-0c02fb55956c7d316 \
    --instance-type t2.micro \
    --key-name MyKeyPair \
    --security-group-ids sg-xxx
```

## 2. Configure Security Group

Allow HTTP (port 80) and SSH (port 22) traffic via the security group tied to your instance.

```bash
aws ec2 authorize-security-group-ingress \
    --group-id sg-xxx \
    --protocol tcp \
    --port 80 \
    --cidr 0.0.0.0/0
```

## 3. SSH into Instance & Install Apache

Connect to the terminal of your remote instance and set up the HTTP Server:

```bash
# Connect to the instance
ssh -i MyKeyPair.pem ec2-user@<public-ip>

# Update packages and install apache
sudo yum install httpd -y

# Start the apache service and enable it to run on boot
sudo systemctl start httpd
sudo systemctl enable httpd
```

## 4. Deploy Website Files

Upload the `website/` files directly into Apache's server directory `/var/www/html/`. Run this command from the root of this project:

```bash
scp -i MyKeyPair.pem -r ./website/* ec2-user@<public-ip>:/var/www/html/
```

## 5. View Your Live Architecture

Navigate to `http://<EC2-PUBLIC-IP>` in your web browser. You should now see the portfolio website fully functional and served via your AWS infrastructure.
