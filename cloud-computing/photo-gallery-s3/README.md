# CC-02: Photo Gallery with S3

This repository contains the interactive demo UI for a static photography portfolio and the step-by-step documentation for deploying it via AWS S3 Static Website Hosting.

## Motivation & Architecture
Hosting static assets is one of the most common and cost-effective uses of the cloud. This project demonstrates how to configure an AWS S3 bucket for public web access to serve a masonry-style image gallery.

- **Frontend**: HTML5, CSS3 Masonry layout, Vanilla JavaScript (Lightbox + Lazy Load)
- **Infrastructure**: AWS S3 Static Website Hosting, Bucket Policies

## Deliverables
1. `/gallery`: The front-end photo gallery. Open `index.html` in your browser.
2. `/aws-setup`: Detailed documentation for creating the S3 Bucket, applying public access policies, and syncing the files via AWS CLI (`setup-guide.md` and `bucket-policy.json`).
