# Playtest Plan - Adaptive Quest AI

This document details how to conduct a small-group playtest (3–5 testers) to validate the game mechanics and adaptive difficulty algorithms.

## 1. Objectives

- Verify if the adaptive difficulty scaling maintains engagement (i.e. is the feedback "Perfect" rather than "Too Hard" or "Too Easy").
- Track accuracy and score curves to ensure no level or topic is disproportionately difficult.
- Identify edge-cases where the procedural generation fails or outputs ambiguous answers.
- Assess general qualitative reactions (satisfaction, readability, excitement).

## 2. Participant Recruitment

Select 3 to 5 testers representing different organizational profiles:
1. **Novice**: Little to no experience with the topics (e.g. non-tech staff playing Cybersecurity basics).
2. **Intermediate**: Basic security/business awareness.
3. **Advanced**: Security/compliance professionals (to stress-test level 5 questions).

## 3. Telemetry Goals

During playtesting, the dashboard should monitor these targets:
- **Completion Rate**: > 80% (users should finish the 5 levels or deplete their 3 lives, rather than abandoning the tab).
- **Session Length**: 2 to 4 minutes per quest.
- **Accuracy Rate**: 60% to 80% (indicates a challenging but fair question flow).
- **CSAT Fun & Usefulness**: > 4.0 / 5.0.

## 4. Test Script (Facilitator Guidelines)

1. **Introduction**: Introduce the prototype. Explain that they are testing an adaptive learning game designed to scale difficulty based on their choices.
2. **Setup**: Instruct them to enter a custom username on the Topic Selection screen (to identify their record).
3. **Free Play**: Let them select a topic (e.g. Cybersecurity basics or AI Ethics) and complete the 5 levels.
4. **Incorrect/Correct Simulation**:
   - Ask them to intentionally guess incorrectly on some questions to check if the difficulty drops.
   - Ask them to play a second time with another topic (checks replay tracking).
5. **Survey Completion**: At the end of the quest, guide them to fill in the feedback form details.
6. **Dashboard Audit**: Open the KPI Dashboard and evaluate their session logs and feedback metrics with them.

## 5. Iteration Heuristics

Based on the feedback, decide the next development step:
- **If Completion Rate is < 50%**: Ease difficulty drops. Instead of dropping difficulty only on wrong answers, perhaps add help hints mid-quest.
- **If CSAT Fun rating is < 3.5**: Enhance the narrative storytelling and incident descriptions to build more excitement.
- **If custom topics have high error rates**: Refine the procedural prompt template to ensure options are highly distinct and clear.
