/**
 * Modules UI Component
 * Handles the interaction for adding and listing modules.
 */

import { currentATM } from '../app.js';
import ValidationEngine from '../engine/validation.js';
import DerivationEngine from '../engine/derivation.js';

const ModulesUI = {
    init: () => {
        const btnAdd = document.getElementById('btn-add-module');
        if (btnAdd) {
            btnAdd.addEventListener('click', ModulesUI.handleAddModule);
        }
        ModulesUI.render();
    },

    handleAddModule: () => {
        const code = document.getElementById('mod-code').value.trim();
        const name = document.getElementById('mod-name').value.trim();
        const theory = parseInt(document.getElementById('mod-theory').value) || 0;
        const practical = parseInt(document.getElementById('mod-practical').value) || 0;

        const newModule = {
            id: Date.now().toString(),
            code,
            name,
            theoreticalHours: theory,
            practicalHours: practical,
            totalHours: theory + practical
        };

        const errors = ValidationEngine.validateModule(newModule);
        if (errors.length > 0) {
            alert(errors.join("\n"));
            return;
        }

        currentATM.modules.push(newModule);
        ModulesUI.render();
        ModulesUI.clearForm();
        
        // Derive all documents after module changes
        DerivationEngine.deriveAll(currentATM);
    },

    clearForm: () => {
        document.getElementById('mod-code').value = '';
        document.getElementById('mod-name').value = '';
        document.getElementById('mod-theory').value = 0;
        document.getElementById('mod-practical').value = 0;
    },

    render: () => {
        const tbody = document.querySelector('#modules-table tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        currentATM.modules.forEach(mod => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${mod.code}</td>
                <td>${mod.name}</td>
                <td>${mod.theoreticalHours}</td>
                <td>${mod.practicalHours}</td>
                <td>${mod.totalHours}</td>
                <td><button class="btn-delete" data-id="${mod.id}">Delete</button></td>
            `;
            tbody.appendChild(tr);
        });

        // Add event listeners for delete buttons
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                currentATM.modules = currentATM.modules.filter(m => m.id !== id);
                DerivationEngine.deriveAll(currentATM);
                ModulesUI.render();
            });
        });
    }
};

export default ModulesUI;
