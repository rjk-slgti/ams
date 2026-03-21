/**
 * Main Application Logic
 * Bootstraps the SLGTI AMS and handles navigation/storage interactions.
 */

import ATM from './engine/atm.js';
import StorageService from './services/storage.js';
import ModulesUI from './ui/modules.js';
import ScopeUI from './ui/scope.js';
import DeliveryUI from './ui/delivery.js';
import EvaluationUI from './ui/evaluation.js';
import ComplianceUI from './ui/compliance.js';
import DerivationEngine from './engine/derivation.js';

// Global state
let currentATM = Object.assign({}, ATM);

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    // Initialize UI Modules
    ModulesUI.init();
    ScopeUI.init();
    DeliveryUI.init();
    EvaluationUI.init();
    ComplianceUI.init();

    // Navigation Logic
    const navButtons = document.querySelectorAll('#main-nav button');
    const sections = document.querySelectorAll('.view-section');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const sectionId = btn.dataset.section;
            
            // Sync UI before showing section
            if (sectionId === 'section-modules') ModulesUI.render();
            if (sectionId === 'section-students') DeliveryUI.renderStudents();
            if (sectionId === 'section-t1') ScopeUI.renderTrainingPlan();
            if (sectionId === 'section-t2') ScopeUI.renderLessonPlans();
            if (sectionId === 'section-ca1') ScopeUI.renderAssessmentPlan();
            if (sectionId === 'section-sa') DeliveryUI.renderAttendance();
            if (sectionId === 'section-tdr') DeliveryUI.renderTDR();
            if (sectionId === 'section-ca2') EvaluationUI.renderMarks();
            if (sectionId === 'section-sdr') EvaluationUI.renderStudentRecords();
            if (sectionId === 'section-pg') EvaluationUI.renderPracticalGuide();
            if (sectionId === 'section-compliance') ComplianceUI.render();

            // Apply Governance Locking
            ComplianceUI.applyLocking();

            // UI Update
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            sections.forEach(s => s.classList.remove('active'));
            document.getElementById(sectionId).classList.add('active');
        });
    });

    // Load ATM from LocalStorage if exists
    const loadedData = StorageService.load();
    if (loadedData) {
        Object.assign(currentATM, loadedData);
        syncContextToUI();
        ComplianceUI.applyLocking();
    }

    // Save Context Button
    document.getElementById('btn-save-context').addEventListener('click', () => {
        currentATM.context.department = document.getElementById('department').value;
        currentATM.context.course = document.getElementById('course').value;
        currentATM.context.academicYear = document.getElementById('academic-year').value;
        currentATM.context.semester = document.getElementById('semester').value;
        
        if (StorageService.save(currentATM)) {
            alert('Academic Context Saved.');
        }
    });

    // Export JSON
    document.getElementById('btn-export-json').addEventListener('click', () => {
        StorageService.exportToJSON(currentATM);
    });

    // Import JSON (Modal Logic)
    const modal = document.getElementById('modal-overlay');
    document.getElementById('btn-import-json').addEventListener('click', () => {
        modal.style.display = 'flex';
    });

    document.getElementById('btn-close-modal').addEventListener('click', () => {
        modal.style.display = 'none';
    });

    document.getElementById('btn-confirm-import').addEventListener('click', async () => {
        const fileInput = document.getElementById('json-file-input');
        if (fileInput.files.length > 0) {
            try {
                const imported = await StorageService.importFromJSON(fileInput.files[0]);
                Object.assign(currentATM, imported);
                syncContextToUI();
                modal.style.display = 'none';
                alert('ATM Data Imported Successfully.');
            } catch (err) {
                alert(err);
            }
        } else {
            alert('Please select a file.');
        }
    });
}

function syncContextToUI() {
    document.getElementById('department').value = currentATM.context.department || '';
    document.getElementById('course').value = currentATM.context.course || '';
    document.getElementById('academic-year').value = currentATM.context.academicYear || '';
    document.getElementById('semester').value = currentATM.context.semester || '1';
}

// Export for other modules in later phases
export { currentATM };
