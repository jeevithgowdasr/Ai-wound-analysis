class HealingScore:
    """
    Proprietary Algorithm to generate a single 'Wound Health Score' (0-100).
    100 = Perfect Healing Trajectory.
    0 = Critical Deterioration.
    """

    @staticmethod
    def calculate_score(
        area_reduction_pct: float, 
        infection_probability: float, 
        slough_pct: float
    ) -> dict:
        """
        Weights:
        - Area Reduction (Trajectory): 50% Importance. (Reducing size is the best sign).
        - Infection Prob (AI Model): 30% Importance. (Infection halts healing).
        - Tissue Quality (Slough): 20% Importance. (Clean bed = good potential).
        
        Args:
        - area_reduction_pct: e.g., 10.0 (10% reduction). Negative means growth.
        - infection_probability: 0.0 to 1.0
        - slough_pct: 0.0 to 100.0
        """
        
        # 1. Base Score (Start at neutral 50)
        score = 50.0
        details = []

        # 2. Factor: Area Trajectory (Range: -30 to +50 points)
        # Goal: >15% reduction in 2 weeks is ideal.
        if area_reduction_pct > 0:
            # Reward up to +50 points for very fast healing (>40%)
            points = min(50, area_reduction_pct * 1.5)
            score += points
            details.append(f"Healing Size (+{int(points)}): Area reduced by {area_reduction_pct}%")
        else:
            # Penalize growth. Cap penalty at -30.
            points = max(-30, area_reduction_pct * 2.0)
            score += points
            details.append(f"Growing Size ({int(points)}): Area increased by {abs(area_reduction_pct)}%")


        # 3. Factor: Infection Probability (Range: 0 to -40 points)
        # We only PENALIZE for infection risk. We don't reward for lack of it (that's baseline).
        if infection_probability > 0.5:
            penalty = (infection_probability - 0.5) * 2 * 40 # Scale 0.5-1.0 to 0-40
            score -= penalty
            details.append(f"Infection Risk (-{int(penalty)}): AI detected signs of infection")


        # 4. Factor: Tissue Quality (Range: +10 to -20 points)
        if slough_pct < 10:
            score += 10
            details.append("Clean Bed (+10): Healthy tissue visible")
        elif slough_pct > 50:
            score -= 20
            details.append("Necrotic Tissue (-20): Wound bed requires debridement")
        else:
            # Neutral/Minor penalty
            score -= (slough_pct / 5.0)

        # Clamp Score 0-100
        final_score = max(0, min(100, score))
        
        # Interpretation
        grade = "Good"
        if final_score < 70: grade = "Fair - Observe"
        if final_score < 40: grade = "Critical - Needs Action"

        return {
            "score": round(final_score),
            "grade": grade,
            "explanation": details
        }
