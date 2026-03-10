/**
 * PoHC Logic (Proof of Human Cognition)
 * Re-implementation of Janio's Unified Field Theory in JavaScript.
 */

class PoHC {
    constructor() {
        this.h_bar = 1.054e-34;
        this.lambda = 0.5;
        this.n = 2;
        this.xi = 0.1;
    }

    calculateInformationDensity(text, entropy = 0.2) {
        const length = text.length;
        // I(x,t) based on length and simulated entropy
        return length * (1 - entropy);
    }

    calculateAdaptiveEnergy(infoDensity, perceptionScore) {
        // Equation (5): QAE
        const i_term = (this.lambda * Math.pow(infoDensity, this.n)) / (1 + Math.pow(infoDensity, this.n));
        const perception_term = 1 / (1 + this.xi * Math.pow(perceptionScore, 2));

        return this.h_bar * (1 + i_term) * perception_term;
    }

    computeScore(text, stats) {
        const I = this.calculateInformationDensity(text);
        const perception = (stats.minerA_score || 0.5) + (stats.minerB_score || 0.5);

        const epsilon = this.calculateAdaptiveEnergy(I, perception);

        // Scale back to a human-readable score relative to h_bar
        return (epsilon / this.h_bar) * 100; // Multiplied for dashboard visibility
    }
}

module.exports = new PoHC();
