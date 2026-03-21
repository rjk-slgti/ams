/**
 * Governance Engine - Phase 5
 * Handles permissions, approval workflows, and document status.
 */

const GovernanceEngine = {
    // Current state access (expects currentATM as input)
    canEdit: (atm) => {
        // Instructor can only edit in "draft" status
        return atm.governance.currentRole === "Instructor" && atm.governance.status === "draft";
    },

    canApproveHOD: (atm) => {
        // HOD can only approve if status is "draft"
        return atm.governance.currentRole === "HOD" && atm.governance.status === "draft";
    },

    canFreezeQMS: (atm) => {
        // QMS can only freeze if status is "reviewed" (HOD approved)
        return atm.governance.currentRole === "QMS" && atm.governance.status === "reviewed";
    },

    // Status transitions
    approveHOD: (atm) => {
        if (!GovernanceEngine.canApproveHOD(atm)) {
            throw new Error("Conditions for HOD Approval not met (Role must be HOD and status must be Draft).");
        }
        atm.governance.status = "reviewed";
        atm.governance.approvals.hod = true;
        atm.governance.timestamps.hod = new Date().toLocaleString();
        return atm;
    },

    freezeQMS: (atm) => {
        if (!GovernanceEngine.canFreezeQMS(atm)) {
            throw new Error("Conditions for QMS Freeze not met (Role must be QMS and HOD must have approved).");
        }
        atm.governance.status = "frozen";
        atm.governance.approvals.qms = true;
        atm.governance.timestamps.qms = new Date().toLocaleString();
        return atm;
    }
};

export default GovernanceEngine;
