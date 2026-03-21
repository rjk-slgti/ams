/**
 * Delivery UI Component - Phase 3
 * Handles Students, Attendance (SA), and Daily Records (TDR).
 */

import { currentATM } from '../app.js';

const DeliveryUI = {
    init: () => {
        document.getElementById('btn-add-student').addEventListener('click', DeliveryUI.handleAddStudent);
        document.getElementById('btn-save-sa').addEventListener('click', DeliveryUI.handleSaveAttendance);
        document.getElementById('btn-save-tdr').addEventListener('click', DeliveryUI.handleSaveTDR);
    },

    // --- Student Management ---
    handleAddStudent: () => {
        const name = document.getElementById('student-name').value.trim();
        if (!name) return alert("Enter student name.");
        
        const student = {
            id: 'S' + Date.now().toString().slice(-8) + Math.floor(Math.random() * 10),
            name: name
        };
        
        currentATM.operations.students.push(student);
        document.getElementById('student-name').value = '';
        DeliveryUI.renderStudents();
    },

    renderStudents: () => {
        const tbody = document.querySelector('#students-table tbody');
        if (!tbody) return;
        tbody.innerHTML = '';
        currentATM.operations.students.forEach(s => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${s.id}</td><td>${s.name}</td>`;
            tbody.appendChild(tr);
        });
    },

    // --- Attendance (SA) ---
    renderAttendance: () => {
        const select = document.getElementById('sa-session');
        const tbody = document.querySelector('#sa-table tbody');
        if (!select || !tbody) return;

        // Populate session select
        select.innerHTML = '<option value="">Select Session</option>';
        currentATM.derived.sessions.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.number;
            opt.textContent = `Session ${s.number}: ${s.moduleCode}`;
            select.appendChild(opt);
        });

        // Set default date to today
        if (!document.getElementById('sa-date').value) {
            document.getElementById('sa-date').value = new Date().toISOString().split('T')[0];
        }

        // Render student list for attendance
        tbody.innerHTML = '';
        if (currentATM.operations.students.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3">No students found. Add students first.</td></tr>';
            return;
        }

        currentATM.operations.students.forEach(s => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${s.name}</td>
                <td><input type="radio" name="att-${s.id}" value="Present" checked></td>
                <td><input type="radio" name="att-${s.id}" value="Absent"></td>
            `;
            tbody.appendChild(tr);
        });
    },

    handleSaveAttendance: () => {
        const sessionNo = document.getElementById('sa-session').value;
        const date = document.getElementById('sa-date').value;
        
        if (!sessionNo) return alert("Select a session.");
        if (!date) return alert("Select a date.");
        if (currentATM.operations.students.length === 0) return alert("Add students first.");

        // Check for duplicates
        const duplicate = currentATM.operations.attendance.find(a => a.sessionNo == sessionNo && a.date === date);
        if (duplicate) return alert("Attendance already saved for this session and date.");

        const records = [];
        currentATM.operations.students.forEach(s => {
            const status = document.querySelector(`input[name="att-${s.id}"]:checked`).value;
            records.push({
                date,
                sessionNo,
                studentId: s.id,
                status
            });
        });

        currentATM.operations.attendance.push(...records);
        alert(`Attendance saved for Session ${sessionNo}`);
    },

    // --- Daily Record (TDR) ---
    renderTDR: () => {
        const select = document.getElementById('tdr-session');
        if (!select) return;

        select.innerHTML = '<option value="">Select Session</option>';
        currentATM.derived.sessions.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.number;
            opt.textContent = `Session ${s.number}: ${s.moduleCode}`;
            select.appendChild(opt);
        });

        if (!document.getElementById('tdr-date').value) {
            document.getElementById('tdr-date').value = new Date().toISOString().split('T')[0];
        }
    },

    handleSaveTDR: () => {
        const sessionNo = document.getElementById('tdr-session').value;
        const date = document.getElementById('tdr-date').value;
        const topic = document.getElementById('tdr-topic').value.trim();
        const remarks = document.getElementById('tdr-remarks').value.trim();
        const issues = document.getElementById('tdr-issues').value.trim();

        if (!sessionNo) return alert("Select a session.");
        if (!date) return alert("Select a date.");
        if (!topic) return alert("Enter topic delivered.");

        // Check for duplicates
        const duplicate = currentATM.operations.dailyRecords.find(r => r.sessionNo == sessionNo && r.date === date);
        if (duplicate) return alert("Daily record already saved for this session and date.");

        const record = { date, sessionNo, topicDelivered: topic, remarks, issues };
        currentATM.operations.dailyRecords.push(record);
        
        // Clear fields
        document.getElementById('tdr-topic').value = '';
        document.getElementById('tdr-remarks').value = '';
        document.getElementById('tdr-issues').value = '';
        
        alert(`Daily record saved for Session ${sessionNo}`);
    }
};

export default DeliveryUI;
