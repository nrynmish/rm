# DTU RM — Student Recruitment & Selection Portal

A lightweight student data processing and recruitment management portal for DTU's Recruitment Manager workflow.

The application is designed around a simple data pipeline:

CSV Dataset → Parsing → Data Cleaning → Cleaned Dataset → Shortlisting → Eligibility Filtering → Export

The goal is to provide a clean interface for taking raw student records, cleaning and validating them, applying recruitment criteria, reviewing eligible candidates, and exporting the final shortlist.

---

## Table of Contents

- [Overview](#overview)
- [Core Workflow](#core-workflow)
- [Pipeline Architecture](#pipeline-architecture)
- [1. Dataset Input](#1-dataset-input)
- [2. CSV Parsing](#2-csv-parsing)
- [3. Data Cleaning](#3-data-cleaning)
- [4. Cleaned Student Records](#4-cleaned-student-records)
- [5. Shortlisting](#5-shortlisting)
- [Minimum Total Score](#minimum-total-score)
- [Eligibility Logic](#eligibility-logic)
- [Average Score](#average-score)
- [Search and Filters](#search-and-filters)
- [Debarring Students](#debaring-students)
- [6. Export](#6-export)
- [Application Structure](#application-structure)
- [Technology Stack](#technology-stack)
- [Running Locally](#running-locally)
- [Production Build](#production-build)
- [Development Principles](#development-principles)
- [Current Scope](#current-scope)
- [Future Improvements](#future-improvements)

---

# Overview

DTU RM is a student selection and recruitment data portal.

The application is intended to replace a manual workflow in which student data has to be inspected, cleaned, filtered, and shortlisted manually.

Instead, the portal provides a structured pipeline:

```text
                    RAW CSV
                       │
                       ▼
                ┌─────────────┐
                │ CSV Parser  │
                └──────┬──────┘
                       │
                       ▼
                ┌─────────────┐
                │   Cleaning  │
                │   Pipeline  │
                └──────┬──────┘
                       │
                       ▼
              CLEANED STUDENT DATA
                       │
                       ▼
                ┌─────────────┐
                │  Shortlist  │
                └──────┬──────┘
                       │
            ┌──────────┼──────────┐
            ▼          ▼          ▼
         Search     Filters    Min Score
            │          │          │
            └──────────┼──────────┘
                       ▼
                 ELIGIBLE SET
                       │
             ┌─────────┴─────────┐
             ▼                   ▼
          Review               Export
