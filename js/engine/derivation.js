/**
 * Derivation Engine
 * Contains pure functions for academic logic calculations.
 */

const SESSION_DURATION_HRS = 1.5; // 90 minutes

const DerivationEngine = {
    /**
     * Calculates the number of sessions required for a module.
     * sessions = ceil(total_hours / 1.5)
     */
    calculateSessions: (totalHours) => {
        return Math.ceil(totalHours / SESSION_DURATION_HRS);
    },

    /**
     * Generates a fixed 90-minute lesson skeleton (5 blocks).
     */
    generateLessonSkeleton: (sessionNo) => {
        return {
            sessionNo: sessionNo,
            blocks: [
                { activity: "Welcome & Introduction", trainer: "GREET students, TAKE attendance", learner: "LISTEN, RESPOND", time: 5 },
                { activity: "Previous Lesson Review", trainer: "ASK review questions", learner: "ANSWER, RECALL", time: 5 },
                { activity: "Teaching & Demonstration", trainer: "EXPLAIN concepts, DEMO steps", learner: "OBSERVE, TAKE notes", time: 30 },
                { activity: "Practical Activities", trainer: "OBSERVE, GUIDE, CORRECT", learner: "PRACTICE, EXECUTE steps", time: 40 },
                { activity: "Recap & Conclusion", trainer: "SUMMARIZE, ASSIGN homework", learner: "ASK questions, NOTE tasks", time: 10 }
            ]
        };
    },

    /**
     * Generates the Training Plan (T1) based on sessions.
     */
    generateTrainingPlan: (sessions) => {
        return sessions.map(session => ({
            month: "",
            week: "",
            session: session.number,
            task: `${session.moduleCode}: ${session.moduleName} (${session.type})`,
            resources: "Standard Toolset",
            assessment: "Continuous"
        }));
    },

    /**
     * Calculates the Assessment Plan (CA1) weighted totals.
     */
    generateAssessmentPlan: (modules) => {
        if (modules.length === 0) return [];
        
        let totalTheory = modules.reduce((sum, m) => sum + m.theoreticalHours, 0);
        let totalPractical = modules.reduce((sum, m) => sum + m.practicalHours, 0);
        let total = totalTheory + totalPractical;

        if (total === 0) return [];

        let theoryWeight = Math.round((totalTheory / total) * 100);
        let practicalWeight = 100 - theoryWeight; // Ensure total is exactly 100

        return [
            { type: "Theory", weight: theoryWeight },
            { type: "Practical", weight: practicalWeight }
        ];
    },

    /**
     * Derives all academic data based on modules.
     */
    deriveAll: (atm) => {
        let allSessions = [];
        let lessonPlans = [];
        let sessionCounter = 1;

        atm.modules.forEach(mod => {
            const numSessions = DerivationEngine.calculateSessions(mod.totalHours);
            
            for (let i = 1; i <= numSessions; i++) {
                const type = (i <= numSessions * (mod.theoreticalHours / mod.totalHours)) ? "Theory" : "Practical";
                
                const session = {
                    number: sessionCounter++,
                    moduleCode: mod.code,
                    moduleName: mod.name,
                    type: type,
                    duration: 90
                };
                allSessions.push(session);
                lessonPlans.push(DerivationEngine.generateLessonSkeleton(session.number));
            }
        });

        atm.derived.sessions = allSessions;
        atm.derived.lessonPlans = lessonPlans;
        atm.derived.trainingPlan = DerivationEngine.generateTrainingPlan(allSessions);
        atm.derived.assessmentPlan = DerivationEngine.generateAssessmentPlan(atm.modules);
    }
};

export default DerivationEngine;
