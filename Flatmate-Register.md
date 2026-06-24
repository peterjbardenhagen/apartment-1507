---
title: Flatmate Register
status: active
type: property-management
tags: [flatmates, accounting, agreements, utility-monitoring]
---

# Flatmate Register

> Apartment 1507 · Boundary Street · Master Occupancy & Billing System

---

## Primary Resident

| Field | Value |
|-------|-------|
| Name | Peter Bardenhagen |
| Status | Owner / Primary Tenant |
| Weekly Rent | $0 (mortgage) |
| Weekly Bills | ~$260 (utilities + insurance + consumables) |
| Parking | 1 space @ $60/week (included) |
| Guest Nights Included | Unlimited (owner) |

---

## Boarder: Kevin

| Field | Value |
|-------|-------|
| Name | Kevin |
| Status | Boarder |
| Weekly Rent | $450 |
| Weekly Bills | $60 estimate |
| Parking | 1 space @ $60/week (included) |
| Guest Nights Included | 1-2 nights per week (4-8/month) |
| Start Date | May 2025 |

### Current Guest Tracking

| Metric | Recorded | Estimated | Delta |
|--------|----------|-----------|-------|
| Guest Nights / Month | 28 | 28 | 24 excess |
| Surcharge Rate | $20/night | $20/night | - |
| **Current Surcharge** | **$560/month** | - | - |
| Energy Increase | +$50/week | - | Confirmed occupancy correlation |

---

## Flatmate Entry Template

```yaml
flatmate_uuid: kevin-abc123
name: Kevin
status: active
agreement_signed: true
agreement_file: "Kevin - Flatmate Agreement 2025-05-01.pdf"
rent_weekly: 450
bills_weekly_estimate: 60
parking_included: true
parking_rate_weekly: 60
guest_nights_included_per_week: 2
guest_nights_routine: false
guest_nights_routine_count: 0
guest_nights_excess_rate_weekly: 20
start_date: 2025-05-01
end_date: null
notes: Boarder. 1-night rule routinely exceeded. Energy correlation confirmed.
```

---

## Agreement Template

```markdown
# Flatmate Agreement · Apartment 1507

**Parties**: Peter Bardenhagen (Owner) & [Flatmate Name]

**Clause G - Guests & Overnight Stays**
- Included: 1-2 nights per week (no charge)
- Excess: $20 per night toward utilities
- Unsupervised: $100 per day (requires public liability insurance)
- Extended stays: Treated as additional occupancy

**Clause C - Utilities**
- Weekly contribution: $60 (electricity, gas, hot water, internet)
- Actual costs split if >$80/week sustained for 2 months

**Parking Addendum**
- $60 per week (included in $450 rate)
- Secure underground space
- Vehicle registered to building management

**Signatures**
Date: _______  Owner: _______  Flatmate: _______
```

---

## Monthly Billing Calculator

```
Rent:        $[X] x 4 = $[XXX]
Bills:       $[Y] x 4 = $[XXX]
Parking:     $[Z] x 4 = $[XXX] (if applicable)
Guest Nights: [Excess] × $20 = $[Amount]
─────────────────────────────────────
TOTAL DUE:   $[Total]

Energy Correlation: [kWh increase] matches [guest nights]
```

---

## Energy Reconciliation

| Week | Kevin Alone | With Guest | kWh | Cost | Guest Nights |
|------|-------------|------------|-----|------|--------------|
| 1 | ✅ | ❌ | 180 | $45 | 2 |
| 2 | ✅ | ✅ | 240 | $60 | 6 |
| 3 | ✅ | ✅ | 250 | $63 | 7 |
| **Avg Delta** | - | +$18 | +70 kWh | **+$15-18** | +5 nights |

---

## Automation Rules

### Guest Night Tracker
```yaml
alias: "Flatmate Guest Night Logger"
trigger:
  - platform: state
    entity_id:
      - binary_sensor.doorbell_visitor_detected
      - binary_sensor.lounge_occupancy
variables:
  flatmate: "kevin"
  guest_threshold_minutes: 120
action:
  - service: input_number.set_value
    target:
      entity_id: input_number.guest_nights_kevin
    data:
      value: "{{ (states('input_number.guest_nights_kevin')|float + 1) }}"
```

### Billing Alert
```yaml
alias: "Flatmate Overstay Warning"
trigger:
  - platform: numeric_state
    entity_id: input_number.guest_nights_kevin
    above: 8
condition:
  - condition: state
    entity_id: sensor.month_number
    state: "{{ now().month }}"
action:
  - service: notify.mobile_app
    data:
      message: "📊 Kevin: 8+ guest nights this month. Excess nights: ${{ (states('input_number.guest_nights_kevin')|int - 8) * 20 }}"
```

---

## Related
- [[Apartment Guardian System]]
- [[Home Assistant Green]]
- [[Boundary Street Property Costs]]