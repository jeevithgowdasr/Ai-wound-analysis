class PatientReportGenerator:
    """
    Generates patient-friendly, non-diagnostic summaries from AI metrics.
    Strictly follows 'Do No Harm' language guidelines.
    """

    @staticmethod
    def generate_summary(healing_status: str, score: int, infection_risk: str) -> str:
        """
        Args:
        - healing_status: 'Healing', 'Stalled', 'Deteriorating' (from postprocess.py)
        - score: 0-100 (from healing_score.py)
        - infection_risk: 'Low', 'High' (derived from model prob > 0.5)
        
        Returns:
        A 2-3 sentence string safe for patient display.
        """
        
        # 1. Opening Statement (Trajectory)
        if healing_status == "Healing":
            opening = "Great progress! Your wound is shrinking nicely."
        elif healing_status == "Stalled":
            opening = "Healing seems to have slowed down a bit recently."
        else: # Deteriorating
            opening = "We noticed the wound area has increased slightly."
            
        # 2. Actionable Advice (Context)
        if score > 75:
            action = "Keep up your current care routine, it's working well."
        elif score > 40:
            action = "Please continue keeping the area clean and protected."
        else:
            action = "It might be a good time to check in with your nurse or doctor."
            
        # 3. Gentle Alert (If Risk is High)
        # NEVER say "You have an infection". Say "signs of redness".
        alert = ""
        if infection_risk == "High":
            alert = " We detected some redness or changes that deserve a closer look by a professional."
        elif healing_status == "Deteriorating":
             alert = " consistent increases in size should be monitored."

        return f"{opening} {action}{alert}"

    @staticmethod
    def get_weekly_insight(velocity: float) -> str:
        """
        velocity: cm2/week reduction.
        """
        if velocity > 0.5:
            return f"You are recovering at a rate of about {velocity} cm² per week."
        elif velocity > 0:
            return "You are seeing slow but steady progress."
        else:
            return "Measuring consistently every day will help us track the trend better."
