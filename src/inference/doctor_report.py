class DoctorReportGenerator:
    """
    Generates concise, observation-based clinical notes ("Objective" section of SOAP note).
    Uses neutral medical terminology.
    """

    @staticmethod
    def generate_clinical_note(
        current_area: float,
        initial_area: float,
        velocity: float,
        slough_pct: float,
        inference_flags: list
    ) -> str:
        """
        Args:
        - current_area: cm2
        - initial_area: cm2
        - velocity: cm2/week
        - slough_pct: % of wound bed
        - inference_flags: list of strings e.g. ["High Redness Index", "Irregular Border"]
        
        Returns:
        Structured clinical text block.
        """
        
        # 1. Morphometrics
        total_reduction = initial_area - current_area
        reduction_pct = (total_reduction / initial_area) * 100 if initial_area > 0 else 0
        
        morphology = (
            f"Wound Area: {current_area} cm². "
            f"Net change: {reduction_pct:+.1f}% from baseline. "
            f"Healing utility: {velocity:+.2f} cm²/week."
        )

        # 2. Tissue Characterization
        context = "Granulating base"
        if slough_pct > 25: context = "Mixed Slough/Granulation"
        if slough_pct > 50: context = "Predominantly Slough/Necrotic"
        
        tissue = f"Tissue Composition: {context} ({slough_pct}% slough burden)."

        # 3. AI Observations
        observations = "No acute visual anomalies detected."
        if inference_flags:
            observations = f"Automated visual flags: {', '.join(inference_flags)}."

        return f"{morphology}\n{tissue}\n{observations}"
