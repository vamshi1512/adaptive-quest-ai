# KPI Framework - Adaptive Quest AI

Telemetry and KPI tracking are critical to proving the value of learning games in a corporate setting. This document outlines the formulas and educational significance of the metrics displayed on the dashboard.

## 1. Core Learning Game Metrics

### Total Sessions
- **Definition**: The count of all unique gameplay sessions initiated by a user.
- **Formula**: `Count(sessions)`
- **Significance**: Indicates overall enrollment and adoption rate.

### Completion Rate
- **Definition**: The percentage of started sessions that were successfully completed (either by completing all 5 levels or depletion of all 3 lives).
- **Formula**: `(Count(sessions where completed = true) / Total Sessions) * 100`
- **Significance**: Primary engagement metric. A low completion rate indicates friction (e.g. game crashes, high frustration, boring UI).

### Replay Count
- **Definition**: The count of sessions started by users who have already played a topic before.
- **Formula**: `Count(sessions where (username, topic) has a previous start_time entry)`
- **Significance**: Measures replayability and voluntary reinforcement. High replayability corresponds to strong educational reinforcement.

## 2. Efficacy & Mastery Metrics

### Average Accuracy
- **Definition**: The percentage of correct responses out of all questions answered.
- **Formula**: `(Sum(correct_answers) / Sum(total_questions)) * 100`
- **Significance**: Indicates how well the player understands the content. Ideal learning target is between 70% and 85%. Too high indicates the bank is too easy; too low indicates it is too difficult.

### Average Score
- **Definition**: The average point score accumulated during sessions.
- **Formula**: `Sum(score) / Total Sessions`
- **Significance**: Since correct answers at higher difficulties yield higher points (`difficulty * 100`), this metric acts as a proxy for player skill. Players navigating higher difficulty questions achieve higher scores.

### Average Session Length
- **Definition**: The mean time spent actively playing a session from start to finish.
- **Formula**: `Average(end_time - start_time) in seconds`
- **Significance**: Indicates attention spans and cognitive load. High session lengths might indicate confusing or excessively wordy questions.

## 3. Qualitative User Feedback (CSAT)

### Customer Satisfaction Index (CSAT)
- **Definition**: Average rating for gameplay fun and usefulness.
- **Formula**: `Sum(was_fun) / Count(feedback)` and `Sum(was_useful) / Count(feedback)`
- **Significance**: Measures user satisfaction. Ensures the training is perceived as valuable and pleasant.

### Difficulty Fit Rating
- **Definition**: Aggregation of opinions on difficulty: "Too Easy", "Perfect", or "Too Hard".
- **Significance**: Calibration telemetry for the adaptive difficulty engine.
