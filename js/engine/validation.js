/**
 * Validation Engine
 * Ensures data integrity and compliance with TVEC/system standards.
 */

const ValidationEngine = {
    validateModule: (module) => {
        const errors = [];
        if (!module.code) errors.push("Module Code is required.");
        if (!module.name) errors.push("Module Name is required.");
        if (module.theoreticalHours < 0) errors.push("Theoretical hours cannot be negative.");
        if (module.practicalHours < 0) errors.push("Practical hours cannot be negative.");
        if (module.theoreticalHours + module.practicalHours <= 0) errors.push("Total hours must be greater than zero.");
        return errors;
    },

    validateLessonTime: (skeleton) => {
        const total = skeleton.reduce((sum, item) => sum + item.duration, 0);
        return total === 90;
    },

    validateAssessmentPlan: (assessments) => {
        const total = assessments.reduce((sum, item) => sum + item.percentage, 0);
        return total === 100;
    }
};

export default ValidationEngine;
