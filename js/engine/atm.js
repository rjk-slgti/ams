/**
 * Academic Truth Model (ATM)
 * Single Source of Truth for the SLGTI Academic Document Management System.
 */
const ATM = {
    context: {
        institution: "SLGTI",
        department: "",
        course: "",
        academicYear: "",
        semester: ""
    },
    modules: [], // Array of module objects: { id, code, name, theoreticalHours, practicalHours, totalHours, assessmentRatio }
    derived: {
        sessions: [],       // Array of session objects
        trainingPlan: [],   // T1 - Training Plan Data
        assessmentPlan: [], // CA1 - Assessment Plan Data
        lessonPlans: [],    // T2 - Lesson Plan Data
        t1: null,           // Legacy/Placeholder
        t2: null,           // Legacy/Placeholder
        ca1: null           // Legacy/Placeholder
    },
    operations: {
        students: [],       // Array of student objects: { id, name }
        attendance: [],     // Array of attendance records: { date, sessionNo, studentId, status }
        dailyRecords: [],    // Array of TDR records: { date, sessionNo, topicDelivered, remarks, issues }
        marks: [],           // Array of CA2 records: { studentId, assessmentType, score }
        studentRecords: [],  // Array of SDR records: { studentId, date, sessionNo, activity, performance, remarks }
        practicalGuides: [], // Array of PG records: { sessionNo, title, steps: [] }
        lastSaved: null,
        version: "1.0.0"
    }
};

export default ATM;
