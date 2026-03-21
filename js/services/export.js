/**
 * Export Service - Phase 6
 * Generates the TVEC Accreditation Pack from ATM data.
 */

const ExportService = {
    generateAccreditationPack: (atm) => {
        const printArea = document.getElementById('printArea');
        if (!printArea) return;

        let html = '';

        // Section 1: Cover Page
        html += ExportService.getCoverPage(atm);

        // Section 2: T1 Training Plan
        html += `<div class="page-break"></div><h2 class="print-header">SECTION 2: T1 TRAINING PLAN</h2>`;
        html += ExportService.getT1HTML(atm);

        // Section 3: T2 Lesson Plans
        html += `<div class="page-break"></div><h2 class="print-header">SECTION 3: T2 LESSON PLANS</h2>`;
        html += ExportService.getT2HTML(atm);

        // Section 4: CA1 Assessment Plan
        html += `<div class="page-break"></div><h2 class="print-header">SECTION 4: CA1 ASSESSMENT PLAN</h2>`;
        html += ExportService.getCA1HTML(atm);

        // Section 5: CA2 Assessment Marks
        html += `<div class="page-break"></div><h2 class="print-header">SECTION 5: CA2 ASSESSMENT MARKS</h2>`;
        html += ExportService.getCA2HTML(atm);

        // Section 6: SA Student Attendance
        html += `<div class="page-break"></div><h2 class="print-header">SECTION 6: SA STUDENT ATTENDANCE</h2>`;
        html += ExportService.getSAHTML(atm);

        // Section 7: TDR Trainer Daily Record
        html += `<div class="page-break"></div><h2 class="print-header">SECTION 7: TDR TRAINER DAILY RECORD</h2>`;
        html += ExportService.getTDRHTML(atm);

        // Section 8: SDR Student Daily Record
        html += `<div class="page-break"></div><h2 class="print-header">SECTION 8: SDR STUDENT DAILY RECORD</h2>`;
        html += ExportService.getSDRHTML(atm);

        // Section 9: TM Teaching Materials
        html += `<div class="page-break"></div><h2 class="print-header">SECTION 9: TM TEACHING MATERIALS SUMMARY</h2>`;
        html += ExportService.getTMHTML(atm);

        // Section 10: PG Practical Guide
        html += `<div class="page-break"></div><h2 class="print-header">SECTION 10: PG PRACTICAL GUIDE</h2>`;
        html += ExportService.getPGHTML(atm);

        printArea.innerHTML = html;
        window.print();
    },

    getCoverPage: (atm) => `
        <div class="cover-page">
            <h1>SLGTI</h1>
            <h2>Accreditation Pack</h2>
            <hr>
            <p><strong>Department:</strong> ${atm.context.department || 'N/A'}</p>
            <p><strong>Course:</strong> ${atm.context.course || 'N/A'}</p>
            <p><strong>Academic Year:</strong> ${atm.context.academicYear || 'N/A'}</p>
            <p><strong>Semester:</strong> ${atm.context.semester || 'N/A'}</p>
            <p><strong>Status:</strong> ${atm.governance.status.toUpperCase()}</p>
            <p style="margin-top: 5rem;">Prepared by: ${atm.governance.currentRole}</p>
            <p>Date: ${new Date().toLocaleDateString()}</p>
        </div>
    `,

    getT1HTML: (atm) => {
        let rows = atm.derived.sessions.map(s => `
            <tr>
                <td>${s.number}</td>
                <td>${s.moduleCode}</td>
                <td>${s.date || ''}</td>
                <td>${s.topic || 'Main Delivery'}</td>
                <td>${s.isPractical ? 'Practical' : 'Theory'}</td>
            </tr>
        `).join('');
        return `<table><thead><tr><th>No</th><th>Module</th><th>Date</th><th>Topic</th><th>Type</th></tr></thead><tbody>${rows}</tbody></table>`;
    },

    getT2HTML: (atm) => {
        return atm.derived.sessions.map(s => `
            <div class="page-break">
                <h3>Session ${s.number}: ${s.moduleCode} - ${s.moduleName}</h3>
                <table>
                    <tr><th>Objective</th><td>${s.topic || 'Deliver core module elements'}</td></tr>
                    <tr><th>Duration</th><td>90 Minutes</td></tr>
                    <tr><th>Delivery</th><td>Introduction (10m), Body (60m), Conclusion (20m)</td></tr>
                </table>
            </div>
        `).join('');
    },

    getCA1HTML: (atm) => {
        let rows = atm.modules.map(m => `
            <tr>
                <td>${m.code}</td>
                <td>${m.name}</td>
                <td>${m.theoreticalHours}</td>
                <td>${m.practicalHours}</td>
                <td>${m.assessmentRatio}%</td>
            </tr>
        `).join('');
        return `<table><thead><tr><th>Code</th><th>Module</th><th>T-Hrs</th><th>P-Hrs</th><th>CA %</th></tr></thead><tbody>${rows}</tbody></table>`;
    },

    getCA2HTML: (atm) => {
        if (atm.operations.marks.length === 0) return "<p>No marks recorded.</p>";
        let rows = atm.operations.marks.map(m => {
            const student = atm.operations.students.find(s => s.id === m.studentId);
            return `<tr><td>${student ? student.name : m.studentId}</td><td>${m.assessmentType}</td><td>${m.score}</td></tr>`;
        }).join('');
        return `<table><thead><tr><th>Student</th><th>Type</th><th>Score</th></tr></thead><tbody>${rows}</tbody></table>`;
    },

    getSAHTML: (atm) => {
        if (atm.operations.attendance.length === 0) return "<p>No attendance records.</p>";
        let rows = atm.operations.attendance.map(a => {
            const student = atm.operations.students.find(s => s.id === a.studentId);
            return `<tr><td>${a.date}</td><td>Session ${a.sessionNo}</td><td>${student ? student.name : a.studentId}</td><td>${a.status}</td></tr>`;
        }).join('');
        return `<table><thead><tr><th>Date</th><th>Session</th><th>Student</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table>`;
    },

    getTDRHTML: (atm) => {
        if (atm.operations.dailyRecords.length === 0) return "<p>No trainer records.</p>";
        let rows = atm.operations.dailyRecords.map(r => `
            <tr><td>${r.date}</td><td>Session ${r.sessionNo}</td><td>${r.topicDelivered}</td><td>${r.remarks}</td></tr>
        `).join('');
        return `<table><thead><tr><th>Date</th><th>Session</th><th>Topic</th><th>Remarks</th></tr></thead><tbody>${rows}</tbody></table>`;
    },

    getSDRHTML: (atm) => {
        if (atm.operations.studentRecords.length === 0) return "<p>No student records.</p>";
        let rows = atm.operations.studentRecords.map(r => {
            const student = atm.operations.students.find(s => s.id === r.studentId);
            return `<tr><td>${r.date}</td><td>${student ? student.name : r.studentId}</td><td>${r.activity}</td><td>${r.performance}</td></tr>`;
        }).join('');
        return `<table><thead><tr><th>Date</th><th>Student</th><th>Activity</th><th>Performance</th></tr></thead><tbody>${rows}</tbody></table>`;
    },

    getTMHTML: (atm) => {
        // Simple summary based on modules
        let rows = atm.modules.map(m => `<tr><td>${m.code}</td><td>PPT, Handouts, Practical Worksheets</td></tr>`).join('');
        return `<table><thead><tr><th>Module</th><th>Materials Used</th></tr></thead><tbody>${rows}</tbody></table>`;
    },

    getPGHTML: (atm) => {
        if (atm.operations.practicalGuides.length === 0) return "<p>No practical guides generated.</p>";
        return atm.operations.practicalGuides.map(g => `
            <div style="margin-bottom: 2rem; border-bottom: 1px dashed #ccc;">
                <h4>${g.title}</h4>
                <p><strong>Steps:</strong></p>
                <ol>${g.steps.map(s => `<li>${s}</li>`).join('')}</ol>
            </div>
        `).join('');
    }
};

export default ExportService;
