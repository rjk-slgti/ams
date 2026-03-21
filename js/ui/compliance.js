/**
 * Compliance UI Component - Phase 5
 * Handles Role Switcher, Approvals, and UI Locking.
 */

import { currentATM } from '../app.js';
import GovernanceEngine from '../engine/governance.js';
import ExportService from '../services/export.js';

const ComplianceUI = {
    init: () => {
        const roleSelector = document.getElementById('role-selector');
        const btnApproveHod = document.getElementById('btn-approve-hod');
        const btnFreezeQms = document.getElementById('btn-freeze-qms');
        const btnGeneratePack = document.getElementById('btn-generate-pack');

        if (roleSelector) {
            roleSelector.value = currentATM.governance.currentRole;
            roleSelector.addEventListener('change', (e) => ComplianceUI.setRole(e.target.value));
        }

        if (btnApproveHod) btnApproveHod.addEventListener('click', ComplianceUI.handleApproveHOD);
        if (btnFreezeQms) btnFreezeQms.addEventListener('click', ComplianceUI.handleFreezeQMS);
        if (btnGeneratePack) btnGeneratePack.addEventListener('click', ComplianceUI.handleGeneratePack);
    },

    handleGeneratePack: () => {
        if (currentATM.governance.status !== 'frozen') {
            return alert("QMS approval (Frozen Status) required before generating the Accreditation Pack.");
        }
        ExportService.generateAccreditationPack(currentATM);
    },

    setRole: (role) => {
        currentATM.governance.currentRole = role;
        ComplianceUI.render();
        ComplianceUI.applyLocking();
    },

    render: () => {
        const statusBadge = document.getElementById('governance-status-badge');
        const hodAudit = document.getElementById('hod-audit-text');
        const btnApproveHod = document.getElementById('btn-approve-hod');
        const qmsAudit = document.getElementById('qms-audit-text');
        const btnFreezeQms = document.getElementById('btn-freeze-qms');
        const auditLog = document.getElementById('audit-log-content');

        if (!statusBadge) return;

        // Current Status
        const status = currentATM.governance.status;
        statusBadge.textContent = status;
        statusBadge.style.background = status === 'frozen' ? '#ffcccc' : (status === 'reviewed' ? '#ccffcc' : '#eee');

        // HOD Status
        if (currentATM.governance.approvals.hod) {
            hodAudit.textContent = `Approved by HOD on: ${currentATM.governance.timestamps.hod}`;
            btnApproveHod.disabled = true;
        } else {
            hodAudit.textContent = "Pending HOD review...";
            btnApproveHod.disabled = !GovernanceEngine.canApproveHOD(currentATM);
        }

        // QMS Status
        if (currentATM.governance.approvals.qms) {
            qmsAudit.textContent = `Frozen by QMS on: ${currentATM.governance.timestamps.qms}`;
            btnFreezeQms.disabled = true;
        } else {
            qmsAudit.textContent = currentATM.governance.approvals.hod ? "Ready for QMS freeze." : "Awaiting HOD approval...";
            btnFreezeQms.disabled = !GovernanceEngine.canFreezeQMS(currentATM);
        }

        // Audit Log
        auditLog.innerHTML = `
            <ul>
                <li><strong>Instructor Status:</strong> Created in Draft</li>
                <li><strong>HOD Status:</strong> ${currentATM.governance.approvals.hod ? 'Approved (' + currentATM.governance.timestamps.hod + ')' : 'Pending'}</li>
                <li><strong>QMS Status:</strong> ${currentATM.governance.approvals.qms ? 'Frozen (' + currentATM.governance.timestamps.qms + ')' : 'Pending'}</li>
            </ul>
        `;
    },

    handleApproveHOD: () => {
        try {
            GovernanceEngine.approveHOD(currentATM);
            alert("Document reviewed and approved by HOD.");
            ComplianceUI.render();
            ComplianceUI.applyLocking();
        } catch (err) {
            alert(err.message);
        }
    },

    handleFreezeQMS: () => {
        try {
            GovernanceEngine.freezeQMS(currentATM);
            alert("Document verified and frozen by QMS. No further edits allowed.");
            ComplianceUI.render();
            ComplianceUI.applyLocking();
        } catch (err) {
            alert(err.message);
        }
    },

    applyLocking: () => {
        const isFrozen = currentATM.governance.status === 'frozen';
        const isReviewed = currentATM.governance.status === 'reviewed';
        const currentRole = currentATM.governance.currentRole;

        // Rule: Only Instructor can edit when status is Draft
        // So if status is NOT Draft, or Role is NOT Instructor -> Disable inputs
        const shouldDisable = isFrozen || isReviewed || currentRole !== 'Instructor';

        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(el => {
            // Keep role-selector and nav buttons enabled always (unless we specify otherwise)
            if (el.id !== 'role-selector') {
                el.disabled = shouldDisable;
            }
        });

        // Exception: Governance buttons in Compliance section have their own logic in render()
        // but the above might have disabled them. Let's re-enable them then let render() handle.
        const btnApproveHod = document.getElementById('btn-approve-hod');
        const btnFreezeQms = document.getElementById('btn-freeze-qms');
        if (btnApproveHod) btnApproveHod.disabled = !GovernanceEngine.canApproveHOD(currentATM);
        if (btnFreezeQms) btnFreezeQms.disabled = !GovernanceEngine.canFreezeQMS(currentATM);
    }
};

export default ComplianceUI;
