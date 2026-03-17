# AnonMitra – Threat Model

## Overview
AnonMitra is a local web application that handles sensitive user data including real credentials, virtual identities, and private messages. This document identifies potential threats, their impact, and the countermeasures implemented.

---

## Assets Being Protected
- User master account credentials (email + password)
- Generated virtual identities (aliases, usernames, passwords)
- Inbox messages and risk scores
- Encryption key
- JWT tokens

---

## Threat 1 — Brute Force Attack
**What it is:** An attacker repeatedly tries different passwords to gain access to a user account.

**Impact:** High — full account takeover, all identities exposed.

**Countermeasure:**
- Rate limiting on `/api/auth/login` — maximum 10 attempts per minute per IP
- Rate limiting on `/api/auth/register` — maximum 5 attempts per minute per IP
- bcrypt hashing with salt — even if database is stolen, passwords cannot be reversed

---

## Threat 2 — SQL Injection
**What it is:** An attacker injects malicious SQL code through input fields to manipulate the database.

**Impact:** High — could expose, modify or delete all user data.

**Countermeasure:**
- SQLAlchemy ORM used throughout — no raw SQL queries anywhere
- All inputs go through Pydantic validation before touching the database
- Invalid data types are rejected automatically before any query runs

---

## Threat 3 — Token Hijacking
**What it is:** An attacker steals a user's JWT token and uses it to impersonate them.

**Impact:** High — attacker gets full access to that user's account and identities.

**Countermeasure:**
- JWT tokens expire after 24 hours automatically
- Tokens are signed with a secret key — cannot be forged or modified
- HTTPS should be used in production to prevent interception in transit

---

## Threat 4 — Database Theft
**What it is:** An attacker gets direct access to the SQLite database file.

**Impact:** Medium — without encryption, all identity credentials would be exposed.

**Countermeasure:**
- All identity passwords and platform names encrypted with AES via Fernet before storing
- Encryption key stored separately in `.env` file, never in the database
- `.env` file excluded from GitHub via `.gitignore`

---

## Threat 5 — Cross Site Request Forgery (CSRF)
**What it is:** A malicious website tricks a logged-in user into making unwanted requests to AnonMitra.

**Impact:** Medium — could modify or delete user data without their knowledge.

**Countermeasure:**
- JWT token required in Authorization header for every protected endpoint
- Token is never stored in cookies — stored in localStorage on frontend
- CORS configured to only allow requests from `localhost:5173`

---

## Threat 6 — Insecure Direct Object Reference (IDOR)
**What it is:** A user manipulates an ID in the URL to access another user's data. For example changing `/api/identities/123` to `/api/identities/124` to see someone else's identity.

**Impact:** High — full exposure of other users' identities and messages.

**Countermeasure:**
- Every protected endpoint verifies the current user's token first
- All database queries filter by `user_id` from the token — not from the URL
- A user can only ever see their own data regardless of what ID they pass

---

## Threat 7 — Sensitive Data Exposure
**What it is:** Sensitive information accidentally leaking through API responses, error messages, or logs.

**Impact:** Medium — could expose internal system details to attackers.

**Countermeasure:**
- Passwords never returned in any API response
- Error messages are generic — never reveal stack traces to the client
- `.env` and `.db` files excluded from GitHub

---

## Summary Table

| Threat | Likelihood | Impact | Status |
|---|---|---|---|
| Brute Force | High | High | ✅ Mitigated |
| SQL Injection | Medium | High | ✅ Mitigated |
| Token Hijacking | Medium | High | ✅ Mitigated |
| Database Theft | Low | High | ✅ Mitigated |
| CSRF | Low | Medium | ✅ Mitigated |
| IDOR | Medium | High | ✅ Mitigated |
| Data Exposure | Medium | Medium | ✅ Mitigated |

---

## Future Scope
- HTTPS enforcement in production
- Two factor authentication
- Session invalidation on logout
- Automatic vault lock after inactivity timeout

