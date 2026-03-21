/**
 * Storage Service
 * Handles persistence of the Academic Truth Model via JSON.
 */

const STORAGE_KEY = "SLGTI_ATM_DATA";

const StorageService = {
    save: (atm) => {
        try {
            const data = JSON.stringify(atm);
            localStorage.setItem(STORAGE_KEY, data);
            atm.operations.lastSaved = new Date().toISOString();
            console.log("ATM saved successfully.");
            return true;
        } catch (error) {
            console.error("Failed to save ATM:", error);
            return false;
        }
    },

    load: () => {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            if (data) {
                console.log("ATM loaded successfully.");
                return JSON.parse(data);
            }
        } catch (error) {
            console.error("Failed to load ATM:", error);
        }
        return null; // Return null if no data or error
    },

    exportToJSON: (atm) => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(atm, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `slgti_atm_${new Date().getTime()}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    },

    importFromJSON: (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const importedData = JSON.parse(event.target.result);
                    resolve(importedData);
                } catch (error) {
                    reject("Invalid JSON file.");
                }
            };
            reader.readAsText(file);
        });
    }
};

export default StorageService;
