import ATM from './engine/atm.js';
import StorageService from './services/storage.js';
import ModulesUI from './ui/modules.js';
import ScopeUI from './ui/scope.js';
import DeliveryUI from './ui/delivery.js';
import EvaluationUI from './ui/evaluation.js';
import ComplianceUI from './ui/compliance.js';

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

    // Navigation & Sidebar Toggle
    const navButtons = document.querySelectorAll('.sidebar-nav button');
    const sections = document.querySelectorAll('.view-section');
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const topbarTitle = document.querySelector('.topbar-title');

    // Sidebar toggle for mobile/compact view
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const sectionId = btn.dataset.section;
            if (!sectionId) return; // Category headers are not buttons or lack data-section

            // Update UI/ATM context based on navigation
            updateSectionData(sectionId);

            // UI Navigation Update
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            sections.forEach(s => s.classList.remove('active'));
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.classList.add('active');
                // Update Topbar Title
                const sectionHeader = targetSection.querySelector('h2');
                if (sectionHeader && topbarTitle) {
                    topbarTitle.textContent = `SLGTI Academic Engine | ${sectionHeader.textContent}`;
                }
            }

            // Close sidebar on mobile after navigation
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
            }
        });
    });

    // Handle initial data load
    const loadedData = StorageService.load();
    if (loadedData) {
        Object.assign(currentATM, loadedData);
        syncContextToUI();
        ComplianceUI.applyLocking();
    }

    // Save Context Button
    const btnSaveContext = document.getElementById('btn-save-context');
    if (btnSaveContext) {
        btnSaveContext.addEventListener('click', () => {
            currentATM.context.department = document.getElementById('department').value;
            currentATM.context.course = document.getElementById('course').value;
            currentATM.context.academicYear = document.getElementById('academic-year').value;
            currentATM.context.semester = document.getElementById('semester').value;
            
            if (StorageService.save(currentATM)) {
                alert('Academic Context Saved.');
            }
        });
    }

    // Export JSON
    const btnExport = document.getElementById('btn-export-json');
    if (btnExport) {
        btnExport.addEventListener('click', () => StorageService.exportToJSON(currentATM));
    }

    // Import JSON (Modal Logic)
    const modal = document.getElementById('modal-overlay');
    const btnImport = document.getElementById('btn-import-json');
    if (btnImport) {
        btnImport.addEventListener('click', () => modal.style.display = 'flex');
    }

    const btnCloseModal = document.getElementById('btn-close-modal');
    if (btnCloseModal) {
        btnCloseModal.addEventListener('click', () => modal.style.display = 'none');
    }

    const btnConfirmImport = document.getElementById('btn-confirm-import');
    if (btnConfirmImport) {
        btnConfirmImport.addEventListener('click', async () => {
            const fileInput = document.getElementById('json-file-input');
            if (fileInput.files.length > 0) {
                try {
                    const imported = await StorageService.importFromJSON(fileInput.files[0]);
                    Object.assign(currentATM, imported);
                    syncContextToUI();
                    ComplianceUI.applyLocking();
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
}

/**
 * Sync data before showing section
 */
function updateSectionData(sectionId) {
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
}

function syncContextToUI() {
    const dept = document.getElementById('department');
    const course = document.getElementById('course');
    const year = document.getElementById('academic-year');
    const sem = document.getElementById('semester');

    if (dept) dept.value = currentATM.context.department || '';
    if (course) course.value = currentATM.context.course || '';
    if (year) year.value = currentATM.context.academicYear || '';
    if (sem) sem.value = currentATM.context.semester || '1';
    
    // Update Topbar via ComplianceUI
    ComplianceUI.render();
}

export { currentATM };
