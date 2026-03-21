/**
 * Sessions UI Component
 * Displays the derived training plan (T1).
 */

import { currentATM } from '../app.js';

const SessionsUI = {
    render: () => {
        const summary = document.getElementById('sessions-summary');
        const tbody = document.querySelector('#t1-table tbody');
        
        if (!summary || !tbody) return;

        const totalHours = currentATM.modules.reduce((sum, m) => sum + m.totalHours, 0);
        const totalSessions = currentATM.derived.sessions.length;

        summary.innerHTML = `
            <div style="background: #e3f2fd; padding:1rem; border-radius:4px; margin-bottom:1rem;">
                <p><strong>Total Module Hours:</strong> ${totalHours} hrs</p>
                <p><strong>Calculated Sessions:</strong> ${totalSessions} sessions (90 min each)</p>
            </div>
        `;

        tbody.innerHTML = '';
        currentATM.derived.sessions.forEach(session => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${session.number}</td>
                <td>${session.moduleCode} - ${session.moduleName}</td>
                <td>${session.duration}</td>
                <td>${session.type}</td>
            `;
            tbody.appendChild(tr);
        });
    }
};

export default SessionsUI;
