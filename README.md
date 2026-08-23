# DTU RM — Student Recruitment & Selection Portal

A lightweight student data processing and recruitment management portal for the **Recruitment Manager (RM) workflow at Delhi Technological University (DTU)**.

The application is designed around a structured data pipeline:

```text
CSV Dataset
     ↓
Parsing
     ↓
Data Cleaning & Normalization
     ↓
Validation
     ↓
Cleaned Student Dataset
     ↓
Eligibility Filtering
     ↓
Shortlisting
     ↓
Review
     ↓
CSV Export
```

The goal is to provide a reliable interface for taking raw student records, cleaning and validating them, applying recruitment criteria, reviewing eligible candidates, managing student eligibility status, and exporting the final shortlist.

---

## Table of Contents

* [Overview](#overview)
* [Core Workflow](#core-workflow)
* [Pipeline Architecture](#pipeline-architecture)
* [1. Dataset Input](#1-dataset-input)
* [2. CSV Parsing](#2-csv-parsing)
* [3. Data Cleaning](#3-data-cleaning)
* [4. Cleaned Student Records](#4-cleaned-student-records)
* [5. Shortlisting](#5-shortlisting)

  * [Minimum Total Score](#minimum-total-score)
  * [Eligibility Logic](#eligibility-logic)
  * [Average Score](#average-score)
  * [Search and Filters](#search-and-filters)
  * [Debarring Students](#debarring-students)
* [6. Export](#6-export)
* [Application Structure](#application-structure)
* [Technology Stack](#technology-stack)
* [Running Locally](#running-locally)
* [Production Build](#production-build)
* [Development Principles](#development-principles)
* [Current Scope](#current-scope)
* [Future Improvements](#future-improvements)

---

# Overview

DTU RM is a student selection and recruitment data portal designed to simplify the processing of student datasets used during recruitment and selection workflows.

A typical manual workflow requires administrators to:

1. Open a raw spreadsheet or CSV.
2. Identify malformed records.
3. Remove duplicate students.
4. Correct inconsistent values and typographical errors.
5. Handle missing values.
6. Verify calculated scores.
7. Apply eligibility criteria.
8. Manually create a shortlist.
9. Remove students who are no longer eligible.
10. Export the final list.

DTU RM consolidates these operations into a single application.

The system separates **data processing** from **presentation and shortlisting**, allowing the raw dataset to be transformed into a consistent internal representation before recruitment filters are applied.

---

# Core Workflow

The application follows the following workflow:

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
                │  Validation │
                └──────┬──────┘
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
```

The important design principle is that **shortlisting operates on cleaned and validated data rather than directly on the raw CSV**.

This prevents malformed input from affecting eligibility calculations.

---

# Pipeline Architecture

The application can be conceptually divided into five stages:

```text
┌──────────────────────────────────────────────┐
│                 DATA INGESTION               │
│                                              │
│                  CSV Upload                  │
└───────────────────────┬──────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────┐
│                 DATA PROCESSING              │
│                                              │
│ Parsing → Normalization → Cleaning           │
└───────────────────────┬──────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────┐
│                  VALIDATION                  │
│                                              │
│ Duplicates → Missing Values → Total Checks  │
└───────────────────────┬──────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────┐
│                 SHORTLISTING                │
│                                              │
│ Search → Filters → Minimum Score → Status   │
└───────────────────────┬──────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────┐
│                    OUTPUT                   │
│                                              │
│              Review → CSV Export             │
└──────────────────────────────────────────────┘
```

Keeping these stages conceptually separate makes the application easier to test, debug, and extend.

---

# 1. Dataset Input

The application accepts student records through a CSV file.

The upload flow is intentionally kept simple:

```text
Select CSV
    ↓
Parse file
    ↓
Validate structure
    ↓
Process records
    ↓
Display cleaned dataset
```

The uploaded file is treated as **raw input**. It should not be modified directly.

Instead, the application creates a cleaned representation of the records for further processing.

### Input validation

Before processing the dataset, the application checks that the uploaded file:

* Is a valid CSV file.
* Contains the expected fields.
* Contains usable student records.
* Contains numeric values where numeric fields are expected.
* Contains sufficient information to identify individual students.

Invalid input should produce a clear UI error rather than silently generating an incorrect shortlist.

---

# 2. CSV Parsing

The CSV parser converts the uploaded file into structured student records.

Conceptually:

```text
CSV
 ↓
Rows
 ↓
Raw Student Objects
 ↓
Normalization
 ↓
Validated Student Objects
```

Each record is transformed into an internal representation that can be consistently consumed by the rest of the application.

A simplified student record can be represented as:

```typescript
type Student = {
  id: string;
  name: string;
  branch: string;
  scores: number[];
  total: number;
  status: "active" | "debarred";
};
```

The exact fields depend on the supplied assessment dataset.

---

# 3. Data Cleaning

Data cleaning is one of the core components of the application.

The cleaning pipeline is responsible for transforming inconsistent raw records into a standardized dataset.

## Duplicate Handling

Duplicate student records are identified before shortlisting.

The system uses stable student-identifying information to determine whether multiple rows represent the same student.

When duplicates are detected:

```text
Raw Records
────────────

Student A
Student B
Student A
Student C
Student B

        ↓

Cleaned Records
───────────────

Student A
Student B
Student C
```

Duplicate records should not artificially increase the number of eligible students.

---

## Missing Values

Missing values are detected during processing.

The handling strategy depends on the field.

For example:

* Missing optional text values can be normalized to an empty/default representation.
* Missing numeric values can be handled according to the dataset's scoring rules.
* Required identity fields should not be silently fabricated.

The cleaning process should preserve data integrity rather than simply replacing every missing value with zero.

---

## Typo and Value Normalization

The pipeline normalizes common inconsistencies.

Examples include:

```text
"CSE"
"cse"
"C.s.e"
```

being interpreted as the same branch where appropriate.

Similarly, unnecessary whitespace and inconsistent capitalization can be normalized:

```text
"  Rahul Kumar "
        ↓
"Rahul Kumar"
```

Normalization is performed before filtering and grouping so that equivalent values are treated consistently.

---

## Total Validation

The `Total` field is treated as a derived value rather than blindly trusting the value present in the CSV.

The application calculates the expected total from the relevant component scores.

Conceptually:

```text
Expected Total = Score 1 + Score 2 + Score 3 + ...
```

The provided `Total` value is then compared with the calculated value.

If the values differ, the calculated value becomes the authoritative total.

Example:

```text
Score 1 = 80
Score 2 = 75
Score 3 = 85

Provided Total = 230
Calculated Total = 240

Final Total = 240
```

This prevents incorrect totals from affecting shortlist eligibility.

---

# 4. Cleaned Student Records

After processing, the application displays the resulting student dataset in a structured table.

A typical representation is:

```text
┌──────────────────────────────────────────────────────────┐
│ Student       Branch      Score 1   Score 2   Total     │
├──────────────────────────────────────────────────────────┤
│ Aditi Sharma  CSE            82        91      173      │
│ Rahul Kumar   ENE            75        84      159      │
│ Arjun Singh   ECE            91        89      180      │
└──────────────────────────────────────────────────────────┘
```

The table provides a single source of truth for the processed dataset.

The UI can additionally expose:

* Total number of records.
* Number of cleaned records.
* Number of duplicates removed.
* Number of values corrected.
* Number of totals recalculated.
* Number of currently active students.
* Number of debarred students.

---

# 5. Shortlisting

Shortlisting is performed on the cleaned and validated dataset.

The shortlist is dynamic and updates whenever recruitment criteria change.

The primary criterion is the **minimum Total Score**.

Additional search and status filters can be applied simultaneously.

---

## Minimum Total Score

The user can specify a minimum required Total Score.

For example:

```text
Minimum Total Score

[ 75 ]
```

If the minimum score is `75`, students satisfying:

```text
Total >= 75
```

are considered for the shortlist.

Changing the threshold immediately updates the displayed shortlist.

Example:

```text
Minimum Score: 70

Eligible: 182
```

Changing it to:

```text
Minimum Score: 80

Eligible: 96
```

The UI should update without requiring a page refresh.

---

## Eligibility Logic

A student is included in the final shortlist only when all applicable conditions are satisfied.

Conceptually:

```text
Eligible =
    Valid Record
    AND Total >= Minimum Score
    AND Status = Active
```

Therefore:

```text
                 ┌───────────────┐
                 │ Student Record│
                 └───────┬───────┘
                         │
                         ▼
                 Valid Record?
                    /       \
                  No         Yes
                  │           │
                Exclude       ▼
                         Total >= Min?
                           /      \
                         No        Yes
                         │          │
                       Exclude      ▼
                              Status Active?
                                /      \
                              No        Yes
                              │          │
                            Exclude    Shortlist
```

This ensures that debarred students cannot remain in the final eligible set simply because they satisfy the score threshold.

---

## Average Score

Where applicable, the application calculates an average score from the relevant component scores.

For `n` scoring components:

```text
Average = (Score₁ + Score₂ + ... + Scoreₙ) / n
```

The displayed value is derived from the processed numerical values rather than relying on potentially inconsistent input.

Average score information can be used for statistics and candidate review without changing the primary eligibility rule unless additional criteria are explicitly configured.

---

## Search and Filters

The shortlist and dataset views support interactive filtering.

Typical controls include:

```text
Search students...

Branch       [ All ▾ ]

Status       [ Active ▾ ]

Minimum Total Score
[ 75 ]
```

Search can be used to locate a student by identifying information such as name or student ID.

Filters can be combined.

For example:

```text
Branch = CSE
Status = Active
Minimum Total = 80
```

produces only students satisfying all three conditions.

Filtering is performed against the in-memory processed dataset so that the UI can respond immediately.

---

## Debarring Students

Each student has an eligibility status:

```text
Active
Debarred
```

A student can be switched from Active to Debarred through the UI.

Example:

```text
Student: Rahul Kumar

Status

[ Active ● ]
```

After toggling:

```text
Student: Rahul Kumar

Status

[ Debarred ● ]
```

The student's status is immediately reflected throughout the application.

If the student was previously present in the shortlist, they are immediately removed from the eligible set.

For example:

```text
Before

Minimum Score: 75

Eligible: 126
```

After debaring an eligible student:

```text
Eligible: 125
```

No page refresh should be required.

---

# 6. Export

The application allows the currently filtered shortlist to be exported as a CSV file.

The exported dataset represents the **current state of the shortlist**, including:

* Applied score threshold.
* Active/debarred state.
* Search/filter criteria.
* Cleaned student information.
* Validated Total values.

The export flow is:

```text
Cleaned Dataset
      ↓
Eligibility Rules
      ↓
Active Status
      ↓
Current Filters
      ↓
Final Shortlist
      ↓
CSV Export
```

The export should contain only the records currently eligible under the active shortlist criteria.

This prevents the administrator from accidentally exporting the entire cleaned dataset when only the filtered shortlist is required.

---

# Application Structure

The project follows a modular structure separating the UI, data-processing logic, and application state.

A typical structure is:

```text
src/
│
├── app/
│   ├── dashboard/
│   │   └── page.tsx
│   │
│   ├── dataset/
│   │   └── page.tsx
│   │
│   ├── cleaning/
│   │   └── page.tsx
│   │
│   └── shortlist/
│       └── page.tsx
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx
│   │   └── AppShell.tsx
│   │
│   ├── dashboard/
│   │   ├── StatCard.tsx
│   │   └── ProcessingSummary.tsx
│   │
│   ├── dataset/
│   │   ├── StudentTable.tsx
│   │   ├── UploadDialog.tsx
│   │   └── DataStats.tsx
│   │
│   └── shortlist/
│       ├── ScoreFilter.tsx
│       ├── ShortlistTable.tsx
│       └── StatusToggle.tsx
│
├── lib/
│   └── csv/
│       ├── parser.ts
│       ├── cleaner.ts
│       ├── validator.ts
│       └── exporter.ts
│
└── store/
    └── student-store.ts
```

The exact structure may evolve during development, but the primary goal is to keep processing logic independent from presentation logic.

---

# Technology Stack

The application uses a modern frontend stack focused on maintainability and responsive interaction.

| Technology       | Purpose                               |
| ---------------- | ------------------------------------- |
| **Next.js**      | Application framework                 |
| **React**        | UI component architecture             |
| **TypeScript**   | Static typing and safer data handling |
| **Tailwind CSS** | Utility-first styling                 |
| **shadcn/ui**    | Reusable interface components         |
| **Lucide**       | Consistent iconography                |
| **Papa Parse**   | CSV parsing and processing            |
| **Zustand**      | Client-side application state         |

The architecture is intentionally lightweight because the assessment primarily evaluates data processing, UI functionality, performance, code quality, and documentation.

---

# Running Locally

## Prerequisites

Install:

* Node.js
* npm

Verify the installation:

```bash
node --version
npm --version
```

---

## Clone the Repository

```bash
git clone https://github.com/nrynmish/rm.git
cd rm
```

---

## Install Dependencies

```bash
npm install
```

---

## Start Development Server

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:3000
```

Open the address in a browser to access the application.

---

# Production Build

Before deployment, create a production build:

```bash
npm run build
```

If the build completes successfully, start the production server with:

```bash
npm start
```

This verifies that the application can compile and run outside the development environment.

---

# Development Principles

## Separation of Concerns

CSV processing should not be tightly coupled to React components.

Instead:

```text
UI
 ↓
Application State
 ↓
Data Processing Functions
 ↓
Processed Dataset
```

This makes the cleaning pipeline independently testable and easier to modify.

---

## Deterministic Processing

Given the same input CSV and processing rules, the cleaning pipeline should produce the same result.

This is particularly important for:

* Duplicate detection.
* Score calculations.
* Total validation.
* Eligibility decisions.

---

## Derived Data

Values such as:

* Total score.
* Average score.
* Eligibility.
* Shortlist count.

should be derived from the underlying student records wherever possible.

This avoids maintaining multiple conflicting versions of the same information.

---

## Immediate UI Updates

Interactions such as:

* Changing the minimum score.
* Searching.
* Applying filters.
* Toggling Active/Debarred.
* Removing a student from eligibility.

should update the UI immediately.

The user should not need to refresh the page to see the resulting state.

---

## Performance

The application is designed to process student records efficiently in memory.

Filtering and shortlist calculations should avoid unnecessary full-page renders or repeated parsing of the original CSV.

The CSV should be parsed once, transformed into structured records, and then reused for subsequent operations.

---

# Current Scope

The current implementation focuses specifically on the technical assessment requirements:

### Data

* CSV upload.
* CSV parsing.
* Student record normalization.
* Duplicate handling.
* Missing-value handling.
* Typo/value normalization.
* Total validation and recalculation.

### Recruitment

* Cleaned student dataset.
* Minimum Total Score filtering.
* Search.
* Additional filters.
* Dynamic shortlist.
* Active/Debarred status.
* Immediate removal of debarred students from eligibility.
* Shortlist statistics.
* CSV export.

### Interface

* Dashboard.
* Dataset view.
* Cleaning information.
* Shortlist view.
* Interactive filtering.
* Responsive UI.
* Consistent component system.

---

# Future Improvements

The current application is intentionally focused on the assessment scope. A production Recruitment Manager platform could be extended with additional functionality.

Potential improvements include:

## Authentication and Authorization

Introduce role-based access control for:

* Administrators.
* Placement officers.
* Recruiters.
* Student representatives.

---

## Persistent Database

Replace client-side state with a persistent database for:

* Student records.
* Recruitment drives.
* Companies.
* Shortlists.
* Eligibility status.
* Processing history.

---

## Recruitment Drives

Support multiple recruitment drives with independent:

* Eligibility criteria.
* Student pools.
* Shortlists.
* Deadlines.
* Recruitment stages.

---

## Audit Logs

Track important administrative actions such as:

```text
Student debarred
Student status restored
Dataset uploaded
Dataset processed
Eligibility threshold changed
Shortlist exported
```

This would provide traceability for recruitment operations.

---

## Advanced Eligibility Rules

Support configurable rules such as:

```text
Minimum CGPA
Maximum number of active offers
Allowed branches
Backlog restrictions
Minimum individual subject score
Placement history
Company-specific criteria
```

---

## Backend Processing

For significantly larger datasets, data processing could be moved to a backend service or asynchronous job queue.

This would allow:

* Larger datasets.
* Persistent processing history.
* Background processing.
* Multi-user access.
* Centralized storage.

---

## Analytics

A future dashboard could provide:

* Branch-wise candidate distribution.
* Score distributions.
* Shortlist conversion rates.
* Recruitment-drive statistics.
* Historical selection trends.

---

# Design Philosophy

The interface is intentionally designed as a **modern SaaS-style workspace rather than a traditional college administration portal**.

The visual system emphasizes:

* Minimalism.
* Clear information hierarchy.
* Soft neutral backgrounds.
* White workspace surfaces.
* Rounded components.
* Subtle borders.
* Restrained shadows.
* Compact typography.
* Responsive interaction.
* Data-first layouts.

The design reference is a modern document/workspace interface, adapted specifically for student recruitment and data processing.

The goal is to make a potentially complex administrative workflow feel simple:

```text
Upload
  ↓
Clean
  ↓
Validate
  ↓
Filter
  ↓
Review
  ↓
Export
```

---

# Assessment Demonstration

The recommended demonstration flow is designed to fit within the required **90-second video limit**:

```text
00:00 ── Upload raw CSV

00:10 ── Show automatic data cleaning

00:25 ── Show cleaned dataset

00:40 ── Apply minimum Total Score

00:55 ── Show live shortlist statistics

01:05 ── Toggle a student to Debarred

01:15 ── Show immediate shortlist update

01:20 ── Export final shortlist CSV

01:30 ── End
```

This demonstrates the core functionality without spending most of the video explaining the interface.

---

# License

This project was developed as part of the **Student Tech Team technical assessment for the Career Development and Industry Engagement (CDIE) Office, Delhi Technological University**.

---

# DTU RM

**Student Data Pipeline & Recruitment Selection Portal**

```text
Raw Data
   ↓
Clean
   ↓
Validate
   ↓
Shortlist
   ↓
Export
```

Built for a cleaner, faster and more reliable student recruitment workflow.
