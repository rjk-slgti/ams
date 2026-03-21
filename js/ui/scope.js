/**
 * Scope UI Component - Phase 2
 * Handles rendering of T1, T2, and CA1 documents.
 */

import { currentATM } from '../app.js';

const ScopeUI = {
    init: () => {
        // initialization if needed
    },

    renderTrainingPlan: () => {
        const tbody = document.querySelector('#t1-table tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        currentATM.derived.trainingPlan.forEach((item, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><input type="text" value="${item.month}" data-index="${index}" data-field="month"></td>
                <td><input type="text" value="${item.week}" data-index="${index}" data-field="week"></td>
                <td>${item.session}</td>
                <td><input type="text" value="${item.task}" data-index="${index}" data-field="task" style="width:100%"></td>
                <td>${item.resources}</td>
                <td>${item.assessment}</td>
            `;
            tbody.appendChild(tr);
        });

        // Add event listeners for inputs
        tbody.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', (e) => {
                const idx = e.target.dataset.index;
                const field = e.target.dataset.field;
                currentATM.derived.trainingPlan[idx][field] = e.target.value;
            });
        });
    },

    renderLessonPlans: () => {
        const container = document.getElementById('t2-container');
        if (!container) return;

        container.innerHTML = '';
        currentATM.derived.lessonPlans.forEach(plan => {
            const wrapper = document.createElement('div');
            wrapper.style.marginBottom = '3rem';
            wrapper.innerHTML = `
                <h3>Session ${plan.sessionNo}</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Activity</th>
                            <th>Trainer Activity</th>
                            <th>Learner Activity</th>
                            <th>Time (min)</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${plan.blocks.map(block => `
                            <tr>
                                <td>${block.activity}</td>
                                <td>${block.trainer}</td>
                                <td>${block.learner}</td>
                                <td>${block.time}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                    <tfoot>
                        <tr style="font-weight: bold; background: #eee;">
                            <td colspan="3">Total Time</td>
                            <td>90</td>
                        </tr>
                    </tfoot>
                </table>
            `;
            container.appendChild(wrapper);
        });
    },

    renderAssessmentPlan: () => {
        const tbody = document.querySelector('#ca1-table tbody');
        const totalCell = document.getElementById('ca1-total');
        const validationMsg = document.getElementById('ca1-validation-msg');
        if (!tbody || !totalCell) return;

        tbody.innerHTML = '';
        let total = 0;
        currentATM.derived.assessmentPlan.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.type}</td>
                <td>${item.weight}%</td>
            `;
            tbody.appendChild(tr);
            total += item.weight;
        });

        totalCell.textContent = `${total}%`;

        if (total === 100) {
            validationMsg.textContent = "✔ Total = 100%";
            validationMsg.style.color = "green";
        } else if (currentATM.modules.length > 0) {
            validationMsg.textContent = "✘ Error: Total must equal 100%";
            validationMsg.style.color = "red";
        } else {
            validationMsg.textContent = "";
        }
    }
};

export default ScopeUI;
