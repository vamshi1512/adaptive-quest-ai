import random
from typing import List, Dict, Any, Optional
from app.models import Question

# =========================================================================
# AI SERVICE ABSTRACTION & REAL API INTEGRATION GUIDE
# =========================================================================
# To integrate a real LLM (like OpenAI GPT-4 or Google Gemini):
#
# 1. Install the SDK: `pip install openai` or `pip install google-generativeai`
# 2. Add API keys to environment variables.
# 3. Modify this class to call the SDK using Structured Outputs (JSON schema).
#    Example with OpenAI:
#
#    class RealAIService:
#        def generate_question(self, topic: str, difficulty: int, excluded_ids: List[str]) -> Question:
#            response = client.beta.chat.completions.parse(
#                model="gpt-4o-mini",
#                messages=[
#                    {"role": "system", "content": "You are a learning game generator. Output a question matching the difficulty (1=easy, 5=hard)."},
#                    {"role": "user", "content": f"Generate a multiple-choice question on: {topic} at difficulty: {difficulty}."}
#                ],
#                response_format=Question
#            )
#            return response.choices[0].message.parsed
# =========================================================================

# --- Hand-Crafted Mock Question Database for Standard Topics ---
MOCK_QUESTIONS_DATABASE: Dict[str, List[Dict[str, Any]]] = {
    "Cybersecurity basics": [
        # Difficulty 1
        {
            "id": "cyber_1_1",
            "text": "What is the primary goal of a phishing email?",
            "options": [
                "To speed up your internet connection",
                "To trick you into revealing sensitive information like passwords or credit cards",
                "To advertise a local cybersecurity conference",
                "To update your computer's operating system automatically"
            ],
            "correct_option_index": 1,
            "difficulty": 1,
            "sub_topic": "Phishing",
            "explanation": "Phishing is a social engineering attack where criminals masquerade as trustworthy entities to steal credentials or financial details."
        },
        # Difficulty 2
        {
            "id": "cyber_2_1",
            "text": "Which of the following is considered the most secure practice for managing passwords?",
            "options": [
                "Using the same strong password across all personal and work accounts",
                "Writing passwords on a sticky note attached to your monitor",
                "Using a password manager to generate and store unique passwords for each account",
                "Changing one character of your password every month (e.g., Password1! to Password2!)"
            ],
            "correct_option_index": 2,
            "difficulty": 2,
            "sub_topic": "Password Security",
            "explanation": "Password managers allow you to maintain distinct, highly complex passwords for every service, eliminating the risks of password reuse."
        },
        # Difficulty 3
        {
            "id": "cyber_3_1",
            "text": "You receive a phone call from someone claiming to be IT support, asking for your password to fix a network issue. What should you do?",
            "options": [
                "Give them the password immediately to avoid work disruption",
                "Give them a temporary password and change it later",
                "Refuse, hang up, and verify the request through your organization's official IT channel",
                "Ask them to prove they are in IT by telling you your employee ID first"
            ],
            "correct_option_index": 2,
            "difficulty": 3,
            "sub_topic": "Social Engineering",
            "explanation": "IT departments should never ask for your password. Hanging up and verifying independently protects against vishing (voice phishing) attacks."
        },
        # Difficulty 4
        {
            "id": "cyber_4_1",
            "text": "How does Multi-Factor Authentication (MFA) defend against credential stuffing attacks?",
            "options": [
                "It encrypts your password locally on your keyboard before transmission",
                "It requires a secondary verification factor, meaning stolen passwords alone are insufficient for entry",
                "It automatically changes your password after every failed login attempt",
                "It blocks IP addresses from countries outside your native home location"
            ],
            "correct_option_index": 1,
            "difficulty": 4,
            "sub_topic": "MFA",
            "explanation": "Credential stuffing relies on automated login with stolen credentials. MFA stops this because the attacker lacks the physical token or authenticator app code."
        },
        # Difficulty 5
        {
            "id": "cyber_5_1",
            "text": "When connecting to a corporate network via a public Wi-Fi hotspot, which protocol is crucial to secure all transit traffic from eavesdropping?",
            "options": [
                "Simple Mail Transfer Protocol (SMTP)",
                "Virtual Private Network (VPN) using IPsec or OpenVPN",
                "Domain Name System Security Extensions (DNSSEC)",
                "File Transfer Protocol (FTP)"
            ],
            "correct_option_index": 1,
            "difficulty": 5,
            "sub_topic": "Public Wi-Fi",
            "explanation": "A VPN creates an encrypted tunnel for all of your traffic, protecting corporate communications from packet sniffing attacks on unencrypted public Wi-Fi."
        }
    ],
    "AI ethics": [
        # Difficulty 1
        {
            "id": "ai_1_1",
            "text": "What does bias in an AI training dataset usually lead to?",
            "options": [
                "The AI system becoming faster and using less energy",
                "Unfair or discriminatory outputs targeting certain demographic groups",
                "The AI completely refusing to answer simple math questions",
                "Automatic translation of data into multiple languages"
            ],
            "correct_option_index": 1,
            "difficulty": 1,
            "sub_topic": "Bias & Fairness",
            "explanation": "If training data contains historical biases or underrepresents certain groups, the AI will learn and perpetuate these biases in its predictions."
        },
        # Difficulty 2
        {
            "id": "ai_2_1",
            "text": "In AI development, what does 'transparency' or 'explainability' refer to?",
            "options": [
                "Making the UI of the AI application look transparent and glass-like",
                "Understanding the reasoning behind how an AI model arrived at a specific decision",
                "Uploading all code publicly to the web without any license restrictions",
                "Ensuring the AI model is capable of generating realistic images"
            ],
            "correct_option_index": 1,
            "difficulty": 2,
            "sub_topic": "Transparency",
            "explanation": "Explainability (XAI) ensures that human operators can audit, understand, and trust the decisions made by complex neural networks."
        },
        # Difficulty 3
        {
            "id": "ai_3_1",
            "text": "When an AI model generates highly confident, factual-sounding statements that are entirely incorrect or fabricated, this is known as:",
            "options": [
                "Supervised learning convergence",
                "Overfitting the validation split",
                "Hallucination",
                "Data leakage"
            ],
            "correct_option_index": 2,
            "difficulty": 3,
            "sub_topic": "Hallucinations",
            "explanation": "Hallucination refers to LLMs producing plausible but false outputs, stemming from their design as statistical word predictors rather than logical truth engines."
        },
        # Difficulty 4
        {
            "id": "ai_4_1",
            "text": "Which ethical principle is violated if an company inputs private customer emails into a public generative AI tool to draft responses?",
            "options": [
                "Algorithmic efficiency",
                "Data privacy and confidentiality",
                "Model accountability",
                "Open-source attribution"
            ],
            "correct_option_index": 1,
            "difficulty": 4,
            "sub_topic": "Data Privacy",
            "explanation": "Feeding proprietary or private information into public models often exposes that data to provider logging, violating confidentiality laws (like GDPR) and internal policies."
        },
        # Difficulty 5
        {
            "id": "ai_5_1",
            "text": "Under the EU AI Act, a machine learning model used to screen resumes and rank job applicants is categorized under which risk tier?",
            "options": [
                "Unacceptable Risk (Banned)",
                "High Risk (Requires strict compliance & human oversight)",
                "Limited Risk (Requires basic transparency only)",
                "Minimal Risk (No regulation)"
            ],
            "correct_option_index": 1,
            "difficulty": 5,
            "sub_topic": "AI Regulation",
            "explanation": "Employment and recruitment software is categorized as 'High Risk' under the EU AI Act due to its potential impact on livelihoods and fairness, requiring audits and logging."
        }
    ],
    "Workplace communication": [
        # Difficulty 1
        {
            "id": "comm_1_1",
            "text": "Which of the following is a key element of 'active listening'?",
            "options": [
                "Formulating your rebuttal while the other person is still speaking",
                "Interrupting to correct small factual errors immediately",
                "Paraphrasing what the speaker said to confirm understanding before responding",
                "Checking your emails so you can multitask during the discussion"
            ],
            "correct_option_index": 2,
            "difficulty": 1,
            "sub_topic": "Active Listening",
            "explanation": "Active listening involves fully concentrating, understanding, responding, and remembering what is said. Paraphrasing validates communication accuracy."
        },
        # Difficulty 2
        {
            "id": "comm_2_1",
            "text": "When sending an urgent email request to a teammate, what is the best practice?",
            "options": [
                "Write 'URGENT!!' in all caps and mark the message priority as high",
                "Include a clear subject line, explain the context, state the exact deadline, and explain why it is urgent",
                "Send short sentences spaced out over 5 separate messages",
                "CC their manager and VP to ensure they feel pressured to answer"
            ],
            "correct_option_index": 1,
            "difficulty": 2,
            "sub_topic": "Email Etiquette",
            "explanation": "Effective email communication is clear, contextualized, and polite. Specifying the exact timeline and reasoning prevents unnecessary friction."
        },
        # Difficulty 3
        {
            "id": "comm_3_1",
            "text": "To deliver constructive feedback that focuses on improvement, what feedback framework is highly recommended?",
            "options": [
                "The 'Hope and Pray' strategy",
                "The 'SBI' (Situation-Behavior-Impact) model",
                "The 'Public Announcement' model",
                "The 'Deflect and Shift' method"
            ],
            "correct_option_index": 1,
            "difficulty": 3,
            "sub_topic": "Feedback Delivery",
            "explanation": "The SBI model (Situation, Behavior, Impact) keeps feedback objective and focused on observable actions rather than personal traits, making it actionable."
        },
        # Difficulty 4
        {
            "id": "comm_4_1",
            "text": "During a project sync, a peer aggressively shuts down a junior colleague's suggestion. What is the most constructive response?",
            "options": [
                "Ignore it to keep the meeting on schedule",
                "Aggressively attack the peer's own performance to defend the junior colleague",
                "Intervene constructively: 'Let's hear out the idea fully before we start evaluating it.'",
                "Message the junior colleague privately and tell them to file a formal HR complaint"
            ],
            "correct_option_index": 2,
            "difficulty": 4,
            "sub_topic": "Conflict Resolution",
            "explanation": "De-escalating the situation constructively protects psychological safety in meetings without turning it into a toxic confrontation."
        },
        # Difficulty 5
        {
            "id": "comm_5_1",
            "text": "What communication phenomenon describes a scenario where remote teams over-rely on asynchronous chats, leading to misaligned project scopes due to lack of high-bandwidth alignment?",
            "options": [
                "The Communication Silo Effect",
                "Asynchronous Polarization",
                "Richness Media Disconnect",
                "Cognitive Load Leakage"
            ],
            "correct_option_index": 2,
            "difficulty": 5,
            "sub_topic": "Remote Collaboration",
            "explanation": "Media Richness Theory states that communication channels vary in their capacity to convey information. Complex, ambiguous tasks require 'rich' channels (like video/meetings) rather than 'lean' channels (like text chat)."
        }
    ],
    "Data privacy": [
        # Difficulty 1
        {
            "id": "priv_1_1",
            "text": "Under data privacy frameworks, what is Personally Identifiable Information (PII)?",
            "options": [
                "Information that is public knowledge and cannot be linked to anyone",
                "Any data that can be used to identify, contact, or locate a specific individual",
                "Product identification numbers stored in warehouse inventory software",
                "Operating system version logs generated by servers"
            ],
            "correct_option_index": 1,
            "difficulty": 1,
            "sub_topic": "PII",
            "explanation": "PII includes names, emails, phone numbers, SSNs, and biometric data. Protecting PII is the core focus of privacy laws."
        },
        # Difficulty 2
        {
            "id": "priv_2_1",
            "text": "The principle of 'Data Minimization' means that organizations should:",
            "options": [
                "Compress files using ZIP format to save storage space",
                "Only collect, process, and retain the minimum amount of personal data necessary for the specified purpose",
                "Pay users to allow them to collect additional browsing details",
                "Delete all database logs every 24 hours"
            ],
            "correct_option_index": 1,
            "difficulty": 2,
            "sub_topic": "Data Minimization",
            "explanation": "Data minimization reduces privacy risks. Organizations must only gather personal information that is strictly required to accomplish the stated business function."
        },
        # Difficulty 3
        {
            "id": "priv_3_1",
            "text": "Under GDPR, if a customer requests that a company delete all their personal account data, what right are they exercising?",
            "options": [
                "The Right to Rectification",
                "The Right to Data Portability",
                "The Right to Erasure (also known as the Right to be Forgotten)",
                "The Right to Restrict Processing"
            ],
            "correct_option_index": 2,
            "difficulty": 3,
            "sub_topic": "GDPR compliance",
            "explanation": "The Right to Erasure (Article 17 of GDPR) permits individuals to request the deletion of their personal data under certain conditions, such as consent withdrawal."
        },
        # Difficulty 4
        {
            "id": "priv_4_1",
            "text": "What is the standard legal timeline under GDPR for a data controller to notify the supervisory authority of a personal data breach?",
            "options": [
                "Within 24 hours of detecting the breach",
                "Within 72 hours of becoming aware of it",
                "Within 30 calendar days",
                "No legal timeline exists, notification is voluntary"
            ],
            "correct_option_index": 1,
            "difficulty": 4,
            "sub_topic": "Data Breaches",
            "explanation": "GDPR Article 33 mandates that personal data breaches must be reported to the relevant authority within 72 hours of discovery, unless the breach is unlikely to result in risk to individuals."
        },
        # Difficulty 5
        {
            "id": "priv_5_1",
            "text": "Which privacy preservation technique adds mathematical noise to a query output so that individual records cannot be reverse-engineered, while keeping overall statistical metrics accurate?",
            "options": [
                "Symmetric Encryption",
                "Pseudonymization",
                "Differential Privacy",
                "Salted Hashing"
            ],
            "correct_option_index": 2,
            "difficulty": 5,
            "sub_topic": "GDPR compliance",
            "explanation": "Differential privacy provides mathematical guarantees of privacy by introducing controlled noise, ensuring individual records cannot be identified even if attackers combine external databases."
        }
    ],
    "Team collaboration": [
        # Difficulty 1
        {
            "id": "team_1_1",
            "text": "What is the primary benefit of 'Psychological Safety' in a team setting?",
            "options": [
                "It guarantees that team members will never disagree on anything",
                "It enables team members to take interpersonal risks, share ideas, and admit mistakes without fear of blame",
                "It allows managers to avoid conducting annual performance reviews",
                "It increases the speed of network routers in the office"
            ],
            "correct_option_index": 1,
            "difficulty": 1,
            "sub_topic": "Psychological Safety",
            "explanation": "Psychological safety, popularized by research at Google, is the belief that one will not be punished or humiliated for speaking up with ideas, questions, concerns, or mistakes."
        },
        # Difficulty 2
        {
            "id": "team_2_1",
            "text": "Which of the following is a classic symptom of 'Groupthink'?",
            "options": [
                "Healthy debates and diverse opinions during brainstorms",
                "Suppression of dissenting opinions in order to maintain artificial team harmony",
                "Using detailed spreadsheets to track project deliverables",
                "Working in a remote setup across different time zones"
            ],
            "correct_option_index": 1,
            "difficulty": 2,
            "sub_topic": "Groupthink",
            "explanation": "Groupthink is a psychological phenomenon where the desire for conformity in a group results in irrational or dysfunctional decision-making by discouraging alternative viewpoints."
        },
        # Difficulty 3
        {
            "id": "team_3_1",
            "text": "In agile frameworks, what is the core purpose of a Sprint Retrospective?",
            "options": [
                "To demo the working software directly to client stakeholders",
                "To reflect on the recent sprint and identify process improvements for the next iteration",
                "To assign new bugs to developers based on performance rankings",
                "To plan the long-term marketing strategy for the product launch"
            ],
            "correct_option_index": 1,
            "difficulty": 3,
            "sub_topic": "Agile Communication",
            "explanation": "The Retrospective focuses on continuous improvement: inspecting how the sprint went regarding people, relationships, process, and tools, and planning actionable enhancements."
        },
        # Difficulty 4
        {
            "id": "team_4_1",
            "text": "To align cross-functional team members, the RACI matrix mapping is often used. What does RACI stand for?",
            "options": [
                "Responsible, Accountable, Consulted, Informed",
                "Ready, Actioned, Cleared, Inspected",
                "Reviewer, Approver, Creator, Integrator",
                "Review, Analyze, Collaborate, Iterate"
            ],
            "correct_option_index": 0,
            "difficulty": 4,
            "sub_topic": "Goal Alignment",
            "explanation": "RACI clarifies roles: Responsible (does the work), Accountable (approves/owns the task), Consulted (provides input), and Informed (updated on progress)."
        },
        # Difficulty 5
        {
            "id": "team_5_1",
            "text": "What collaborative model describes how groups progress through stages of 'Forming, Storming, Norming, Performing, and Adjourning'?",
            "options": [
                "Tuckman's Stages of Group Development",
                "The Kanban Team Flow Model",
                "The Lencioni Trust Framework",
                "The Hersey-Blanchard Leadership Grid"
            ],
            "correct_option_index": 0,
            "difficulty": 5,
            "sub_topic": "Skill Diversity",
            "explanation": "Tuckman's model (1965) details the essential phases a team undergoes to overcome conflicts, align behaviors, and reach maximum performance potential."
        }
    ]
}


class AIService:
    """
    AI Service providing question generation, feedback, and summary generation.
    Utilizes a rich mock database and a fallback procedural question generator
    for custom input topics.
    """

    def generate_question(self, topic: str, difficulty: int, excluded_ids: Optional[List[str]] = None) -> Question:
        """
        Retrieves or generates a question matching the specified topic and difficulty.
        """
        if excluded_ids is None:
            excluded_ids = []

        # Normalise topic key
        matched_topic = None
        for db_topic in MOCK_QUESTIONS_DATABASE.keys():
            if db_topic.lower() == topic.lower() or topic.lower() in db_topic.lower():
                matched_topic = db_topic
                break

        if matched_topic:
            # Filter by difficulty and exclude already answered questions
            available = [
                q for q in MOCK_QUESTIONS_DATABASE[matched_topic]
                if q["difficulty"] == difficulty and q["id"] not in excluded_ids
            ]

            # Fallback if all questions are excluded or none match difficulty exactly
            if not available:
                available = [
                    q for q in MOCK_QUESTIONS_DATABASE[matched_topic]
                    if q["difficulty"] == difficulty
                ]
            if not available:
                # If still empty, fall back to any difficulty in this topic
                available = [q for q in MOCK_QUESTIONS_DATABASE[matched_topic]]

            if available:
                raw_q = random.choice(available)
                return Question(
                    id=raw_q["id"],
                    text=raw_q["text"],
                    options=raw_q["options"],
                    correct_option_index=raw_q["correct_option_index"],
                    difficulty=raw_q["difficulty"],
                    sub_topic=raw_q["sub_topic"],
                    explanation=raw_q["explanation"]
                )

        # Procedural fallback for custom topics or missing database content
        return self._generate_procedural_question(topic, difficulty, excluded_ids)

    def _generate_procedural_question(self, topic: str, difficulty: int, excluded_ids: List[str]) -> Question:
        """
        Generates a plausible question dynamically based on a custom topic using a template.
        """
        sub_topics = ["Fundamentals", "Advanced Concepts", "Best Practices", "Common Pitfalls", "Case Study"]
        sub_topic = sub_topics[min(difficulty - 1, len(sub_topics) - 1)]
        
        diff_adjective = ["elementary", "basic", "moderate", "highly analytical", "strategic advanced"][difficulty - 1]
        
        options = [
            f"Optimizing metrics and following standard regulatory guidelines for {topic}.",
            f"Neglecting security configurations and treating {topic} as a secondary priority.",
            f"Encouraging cross-functional alignment and automated feedback loops.",
            f"Isolating the project team and limiting transparency."
        ]
        
        # We want correct answer to be index 0
        # Let's shuffle options and keep track of where correct one went
        correct_text = options[0]
        random.shuffle(options)
        correct_index = options.index(correct_text)

        q_id = f"proc_{topic.replace(' ', '_').lower()}_{difficulty}_{random.randint(100, 999)}"

        return Question(
            id=q_id,
            text=f"Regarding {topic}, which of the following represents a {diff_adjective} recommendation or core principle?",
            options=options,
            correct_option_index=correct_index,
            difficulty=difficulty,
            sub_topic=sub_topic,
            explanation=f"A key standard practice for {topic} is {correct_text.lower()} This is essential to prevent operational failures and align teams."
        )

    def generate_feedback(self, question_text: str, selected_option: str, correct_option: str, is_correct: bool, difficulty: int) -> str:
        """
        Generates a conversational reaction to the user's answer.
        In production, this would use a fast LLM to provide encouragement and specific coaching.
        """
        difficulty_phrases = [
            "good start", "solid progress", "intermediate level challenge", 
            "tough advanced concept", "mastery-level problem"
        ]
        phrase = difficulty_phrases[min(difficulty - 1, 4)]

        if is_correct:
            return f"Excellent work! You correctly selected '{selected_option}'. This is indeed the correct answer, demonstrating your grasp of this {phrase}."
        else:
            return f"Not quite. You selected '{selected_option}'. The correct choice is '{correct_option}'. Reviewing this {phrase} will help strengthen your knowledge in this sub-topic."

    def generate_learning_summary(self, username: str, topic: str, score: int, total_questions: int, accuracy: float, weak_areas: List[str]) -> str:
        """
        Generates a summary of the session's learning performance.
        In production, this would review the session details and generate a personalized coach report.
        """
        if accuracy >= 80:
            rating = "outstanding performance"
            coaching = "You have demonstrated strong mastery of the core concepts! We recommend moving to a new topic or trying a higher starting difficulty."
        elif accuracy >= 50:
            rating = "good effort"
            coaching = "You have a solid foundation but encountered some difficulties. Consider replaying this quest to secure a higher accuracy score."
        else:
            rating = "development opportunity"
            coaching = "This is a challenging topic. We suggest reviewing the study materials and retrying to build confidence."

        weak_areas_str = ", ".join(weak_areas) if weak_areas else "None! Excellent coverage."

        return (
            f"Adaptive Learning Summary for {username} on '{topic}':\n\n"
            f"This session was a {rating} with an overall accuracy of {accuracy:.1f}% ({score}/{total_questions} correct). "
            f"{coaching}\n\n"
            f"Areas for further review: {weak_areas_str}."
        )
