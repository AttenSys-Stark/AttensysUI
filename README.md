# Attensys

## Overview
AttenSys is a platform designed to revolutionize the management of educational certifications for participating in bootcamps, attendance tracking for events & online classes, and online courses certifications. It offers a secure, transparent, and user-friendly solution for organizations, educational institutions, and event planners to streamline their processes and enhance user engagement. By leveraging Starknet, AttenSys ensures the authenticity and traceability of certifications and attendance records while simplifying course participation and event management.

## Key Features
### 1. Event Management
- Create and manage events seamlessly.
- Enable participants to register for events.
- Mark attendance using QR code scanning.
- Issue certificates in the form of NFTs for attendees upon successful participation

### 2. Online Course Management
- Offer paid or free online courses similar to platforms like Udemy.
- Allow content creators to upload course materials, including recorded video lectures.
- Issue certificates to participants upon course completion.
- Track participant progress with an intuitive system.

### 3. Bootcamp Attendance Management
- Organize and manage bootcamp classes.
- Facilitate student registration and attendance tracking.
- Automate certificate issuance at the end of the program.

### 4. Blockchain Integration
- Certification and attendance records are stored securely on the blockchain (Starknet).
- Users can verify the authenticity of certifications via the platform's explorer, similar to Etherscan.

### 5. User Role Management
- AttenSys supports various user roles to meet different needs:
- Administrators: Oversee platform usage, manage users, and ensure smooth operations.
- Instructors: Create and manage courses, upload materials, and track participant progress.
- Students/Participants: Enroll in courses & bootcamps, attend events, and earn certificates.
- Event Organizers: Manage events, track registrations, and handle attendance.
- Public Explorer: Verify the authenticity of certificates and attendance records

### 6. Sponsorship and Api endpoint
- Attensys will facilitate sponsorship for events organization and Bootcamps 
- Third party apps will be able to verify certificates through attensys api endpoints

## Benefits
### For Organizations
- Simplify event/bootcamp management and attendance tracking for classes and events (access to metrics).
- Enhance credibility with verifiable, blockchain-based certificates.
- Increase sponsorship opportunities through transparent records.

### For Educators
- Monetize knowledge by creating paid courses.
- Automate course and certificate management.
- Track participation

### For Participants
- Access high-quality courses and events.
- Earn and showcase verifiable certificates.
- Build a professional portfolio with blockchain-backed records.


## How It Works

### Registration
- Organizations creates profile, proceeds to creating bootcamp & add instructors. Event planners create events every other user only needs to connect wallet.
- Participants register for courses, bootcamps or events.

### Attendance Tracking
- Events utilize QR codes for attendance marking. students only need to interact with a button to sign.

### Certificate Issuance
- Upon completion, certificates are automatically issued and stored on the blockchain.
- Users can share and verify certificates through the AttenSys explorer.

### Course and Event Management
- Admins and organizers manage materials, track progress, and oversee attendance effortlessly.

## Use Cases
### Universities and Schools
- Manage academic records, track attendance, and issue secure transcripts.

### Corporate Training
- Conduct employee training sessions and reward certifications upon completion.

### Event Planners
- Organize large-scale conferences or workshops with real-time attendance tracking and automated certification.

### Bootcamps
- Streamline the management of coding bootcamps and other intensive programs.
### Educators 
- Create paid/free courses



## Why Choose AttenSys?
- Transparency: Blockchain-backed certificates ensure authenticity and trust.
- Automation: Reduce manual overhead with automated processes.
- Scalability: Designed to handle large-scale events and courses.
- User-Friendly: Intuitive interface for all user roles.
- Security: Robust architecture ensures data integrity and privacy.



## Running locally:
Clone repo and checkout to main-mirror branch
```bash 
git clone https://github.com/AttenSys-Stark/AttensysUI.git
git checkout main-mirror
```

Create .env.local in root folder. Obtain the field data by creating an account and api key on pinata and fill it below.
```bash
NEXT_PUBLIC_PINATA_JWT=
NEXT_PUBLIC_GATEWAY_URL=
```

run yarn to install dependencies and yarn dev to spin up server
```bash
yarn 
#
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

