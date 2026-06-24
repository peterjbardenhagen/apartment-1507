---
title: Apartment 1507 Guardian
status: active
type: home-monitoring
tags: [home-assistant, accounting, utilities, ai-monitoring, flatmate-billing]
---

# Apartment 1507 Guardian System

> Home Master Orchestrator: Security + AI Monitoring + Utility Accounting + Guest Night Billing

## Current Issue: Utility Cost Anomaly

| Metric | Normal | Current | Delta |
|--------|--------|---------|-------|
| **Energy/Week** | ~$200 | ~$250 | **+$50** |
| **Guest Nights / Month** | 4 (in contract) | ~28 (detected) | **24 excess** |
| **Estimated Surcharge** | $80 | **$480+** | **$400+** unpaid |

### Root Cause
Kevin's girlfriend staying 7 nights/week while he works = 24+ excess nights/month = $480+ unpaid surcharge. Energy use correlates with occupancy.

---

## System Architecture

```
graph TB
  subgraph "ENTRY DETECTION"
    DOOR[EZVIZ Doorbell Cam<br/>Visitor logging]
    PRESENCE[Aqara FP2<br/>mmWave Presence]
    BEDDOOR[Master Bedroom<br/>Contact Sensor]
  end

  subgraph "UTILITY MONITORING"
    POWER[Power Monitoring<br/>Smart Plugs + Solar]
    WATER[Water Monitoring<br/>Hot Water Meter]
    GAS[Gas Monitoring<br/>Meter Integration]
  end

  subgraph "NOISE INTELLIGENCE"
    NOISE[ESP32 Sound Sensor<br/>dB threshold - no recording]
    AI[Apartment Guardian AI<br/>Shelby - Anomaly Detection]
  end

  subgraph "HOME ASSISTANT GREEN"
    HA[HA Green Hub<br/>Automations + Alerts]
    LEDGER[Guest Night Ledger<br/>Monthly Accounting]
    REPORT[PDF Statements<br/>Automated Billing]
  end

  DOOR --> HA
  PRESENCE --> HA
  BEDDOOR --> HA
  POWER --> HA
  WATER --> HA
  GAS --> HA
  NOISE --> AI
  AI --> HA
  HA --> LEDGER
  HA --> REPORT
```

---

## Hardware Requirements

| Area | Device | Purpose | Cost |
|------|--------|---------|------|
| Front Door | Wired EZVIZ Doorbell Camera | Arrival/departure detection | $150 |
| Lounge | Aqara FP2 mmWave | Occupancy detection (no camera) | $100 |
| Bedrooms | HLK-LD2410B + ESPHome | Presence without video | $40 each |
| Master Bedroom | Zigbee Contact Sensor | Door access alerts | $25 |
| Common Areas | ESP32 Sound Sensor | Noise threshold alerts | $35 |
| Hub | Home Assistant Green | Automation engine | $130 |

---

## Flatmate Billing Rules (Proposed Legal Text)

### Guest Night Clause
```
Clause G - Guests & Overnight Stays

1. Included stays: 1-2 nights per week (4-8 nights per calendar month)
2. Excess nights: $20 per night toward utilities, hot water, electricity, consumables
3. Unsupervised guests: Additional $100 per day (requires Public Liability insurance)
4. Unapproved extended stays: Treated as additional occupancy at market rate ($200+/week)
```

---

## Automations

### Guest Night Detection
```yaml
alias: "Guest Night Ledger Entry"
trigger:
  - platform: state
    entity_id: binary_sensor.doorbell_visitor_detected
condition:
  - condition: state
    entity_id: binary_sensor.lounge_occupancy
    state: "on"
    for: "02:00:00"
action:
  - service: input_number.set_value
    target:
      entity_id: input_number.guest_nights_month
    data:
      value: "{{ states('input_number.guest_nights_month')|int + 1 }}"
```

### Noise Anomaly Detection
```yaml
alias: "Party Detection Alert"
trigger:
  - platform: numeric_state
    entity_id: sensor.sound_level_db
    above: 75
condition:
  - condition: state
    entity_id: binary_sensor.lounge_occupancy
    state: "on"
    for: "00:30:00"
  - condition: numeric_state
    entity_id: sensor.doorbell_events_hour
    above: 8
action:
  - service: notify.mobile_app
    data:
      message: "⚠️ Excess noise + occupancy detected. Possible party in progress."
```

### Master Bedroom Alert
```yaml
alias: "Private Room Access Alert"
trigger:
  - platform: state
    entity_id: binary_sensor.master_bedroom_door
    to: "on"
condition:
  - condition: state
    entity_id: person.peter
    state: "not_home"
action:
  - service: notify.mobile_app
    data:
      message: "🚨 Master bedroom door opened while Peter away at {{ now().strftime('%H:%M') }}"
```

---

## Monthly Statement Template

| Item | Amount |
|------|--------|
| Weekly Rent | $390 |
| Weekly Utilities | $60 |
| Included Guest Nights | 4/month |
| Guest Nights Used | 28/month (current) |
| Excess Guest Nights | 24 |
| **Additional Occupancy Charge** | **$480** |
| **Total Due** | **$930** |

---

## AI Configuration (Shelby Integration)

Voice AI Provider:
- Local Whisper (STT)  
- Piper (TTS)
- Ollama (Qwen2.5-Coder for accounting logic)

Commands:
- "Hermes, show me last month's guest nights"
- "Report energy usage anomaly"
- "Send Kevin his billing statement"

---

## Energy Investigation Plan

1. **Baseline Measurement**: 3 days with Kevin alone
2. **Compare**: 3 days with full occupancy
3. **Isolate**: Smart plugs on high-draw appliances (AC, heater, dryer)
4. **Correlate**: Guest nights vs. kWh using HA history
5. **Evidence**: Generate CSV + chart for legal/contractual reference

---

## Implementation Priority

1. ✅ Install EZVIZ doorbell (currently installed)
2. ⬜ Add Aqara FP2 for occupancy
3. ⬜ Configure guest night ledger
4. ⬜ Set up noise sensors
5. ⬜ Deploy Shelby AI voice interface
6. ⬜ Generate first automated statement