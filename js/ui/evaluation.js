/**
 * Evaluation UI Component - Phase 4
 * Handles CA2 (Marks), SDR (Student Records), and PG (Practical Guides).
 */

import { currentATM } from '../app.js';

const EvaluationUI = {
    init: () => {
        const btnSaveCa2 = document.getElementById('btn-save-ca2');
        const btnSaveSdr = document.getElementById('btn-save-sdr');
        
        if (btnSaveCa2) btnSaveCa2.addEventListener('click', EvaluationUI.handleSaveMarks);
        if (btnSaveSdr) btnSaveSdr.addEventListener('click', EvaluationUI.handleSaveSdr);
    },

    // --- CA2: Assessment Marks ---
    renderMarks: () => {
        const tbody = document.querySelector('#ca2-table tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        if (currentATM.operations.students.length === 0) {
            tbody.innerHTML = '<tr><td colspan="2">No students found. Add students in Student Management.</td></tr>';
            return;
        }

        currentATM.operations.students.forEach(s => {
            const tr = document.createElement('tr');
            // Check if mark already exists for this student and type
            const type = document.getElementById('ca2-type').value;
            const existing = currentATM.operations.marks.find(m => m.studentId === s.id && m.assessmentType === type);
            
            tr.innerHTML = `
                <td>${s.name}</td>
                <td><input type="number" class="ca2-score" data-id="${s.id}" min="0" max="100" value="${existing ? existing.score : ''}" placeholder="0-100"></td>
            `;
            tbody.appendChild(tr);
        });
    },

    handleSaveMarks: () => {
        const type = document.getElementById('ca2-type').value;
        const inputs = document.querySelectorAll('.ca2-score');
        const newMarks = [];

        for (const input of inputs) {
            const val = input.value.trim();
            if (val === '') continue;
            
            const score = parseFloat(val);
            if (isNaN(score) || score < 0 || score > 100) {
                return alert(`Invalid score for student ID ${input.dataset.id}. Must be between 0 and 100.`);
            }

            newMarks.push({
                studentId: input.dataset.id,
                assessmentType: type,
                score: score
            });
        }

        if (newMarks.length === 0) return alert("No marks entered.");

        // Update ATM (Merge or Overwrite for same student+type)
        newMarks.forEach(nm => {
            const idx = currentATM.operations.marks.findIndex(m => m.studentId === nm.studentId && m.assessmentType === nm.assessmentType);
            if (idx > -1) {
                currentATM.operations.marks[idx] = nm;
            } else {
                currentATM.operations.marks.push(nm);
            }
        });

        alert(`Marks saved for ${type} assessment.`);
    },

    // --- SDR: Student Daily Record ---
    renderStudentRecords: () => {
        const sessionSelect = document.getElementById('sdr-session');
        const studentSelect = document.getElementById('sdr-student');
        if (!sessionSelect || !studentSelect) return;

        // Populate Session Select
        sessionSelect.innerHTML = '<option value="">Select Session</option>';
        currentATM.derived.sessions.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.number;
            opt.textContent = `Session ${s.number}: ${s.moduleCode}`;
            sessionSelect.appendChild(opt);
        });

        // Populate Student Select
        studentSelect.innerHTML = '<option value="">Select Student</option>';
        currentATM.operations.students.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.id;
            opt.textContent = s.name;
            studentSelect.appendChild(opt);
        });

        if (!document.getElementById('sdr-date').value) {
            document.getElementById('sdr-date').value = new Date().toISOString().split('T')[0];
        }
    },

    handleSaveSdr: () => {
        const sessionNo = document.getElementById('sdr-session').value;
        const studentId = document.getElementById('sdr-student').value;
        const date = document.getElementById('sdr-date').value;
        const performance = document.getElementById('sdr-performance').value;
        const activity = document.getElementById('sdr-activity').value.trim();
        const remarks = document.getElementById('sdr-remarks').value.trim();

        if (!sessionNo || !studentId || !date || !activity) {
            return alert("Please fill in all required fields (Session, Student, Date, Activity).");
        }

        // Duplicate check
        const duplicate = currentATM.operations.studentRecords.find(r => r.studentId === studentId && r.sessionNo == sessionNo && r.date === date);
        if (duplicate) return alert("A record already exists for this student, session, and date.");

        const record = { studentId, sessionNo, date, activity, performance, remarks };
        currentATM.operations.studentRecords.push(record);

        // Clear activity and remarks
        document.getElementById('sdr-activity').value = '';
        document.getElementById('sdr-remarks').value = '';
        
        alert("Student Daily Record saved.");
    },

    // --- PG: Practical Guide ---
    renderPracticalGuide: () => {
        const container = document.getElementById('pg-container');
        if (!container) return;

        container.innerHTML = '';
        // Only for practical sessions (Hours/Type logic)
        // Note: Total hours = 90 min = 1.5h. 
        // Sessions are derived based on theoreticalHours and practicalHours.
        // In derivation.js, we don't explicitly tag sessions as Theory/Practical, 
        // but TVEC implies sessions follow the module structure.
        // For Phase 4, we'll assume sessions with "Practical" activity in T1/T2 are practical.
        // Or simpler: sessions derived from practical hours. 
        // Let's check session numbers against theoretical session count.
        
        const totalTheoryHours = currentATM.modules.reduce((sum, m) => sum + m.theoreticalHours, 0);
        const theorySessions = Math.ceil(totalTheoryHours / 1.5);

        const practicalSessions = currentATM.derived.sessions.filter(s => s.number > theorySessions);

        if (practicalSessions.length === 0) {
            container.innerHTML = '<p>No practical sessions found to generate guides.</p>';
            return;
        }

        practicalSessions.forEach(ps => {
            // Find existing Guide or use default
            let guide = currentATM.operations.practicalGuides.find(g => g.sessionNo == ps.number);
            if (!guide) {
                guide = {
                    sessionNo: ps.number,
                    title: `Practical Guide: ${ps.moduleCode} - ${ps.moduleName}`,
                    steps: ["Preparation", "Execution", "Safety", "Completion"]
                };
                currentATM.operations.practicalGuides.push(guide);
            }

            const div = document.createElement('div');
            div.className = 'document-card';
            div.style.marginBottom = '2rem';
            div.innerHTML = `
                <h3>Session ${ps.number}: ${ps.moduleCode}</h3>
                <div class="form-group">
                    <label>Guide Title</label>
                    <input type="text" value="${guide.title}" onchange="EvaluationUI.updatePgTitle(${ps.number}, this.value)">
                </div>
                <div class="form-group">
                    <label>Steps (One per line)</label>
                    <textarea rows="5" onchange="EvaluationUI.updatePgSteps(${ps.number}, this.value)">${guide.steps.join('\n')}</textarea>
                </div>
            `;
            container.appendChild(div);
        });
    },

    updatePgTitle: (sessionNo, val) => {
        const guide = currentATM.operations.practicalGuides.find(g => g.sessionNo == sessionNo);
        if (guide) guide.title = val;
    },

    updatePgSteps: (sessionNo, val) => {
        const guide = currentATM.operations.practicalGuides.find(g => g.sessionNo == sessionNo);
        if (guide) guide.steps = val.split('\n').filter(s => s.trim() !== '');
    }
};

// Expose to global for onchange handlers
window.EvaluationUI = EvaluationUI;

export default EvaluationUI;
