/**
 * Export Service
 * Handles exporting documents to HTML/Printable format.
 */

const ExportService = {
    printElement: (elementId, title) => {
        const el = document.getElementById(elementId);
        if (!el) return;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>${title}</title>
                    <style>
                        body { font-family: sans-serif; padding: 20px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #000; padding: 10px; text-align: left; }
                        th { background: #f0f0f0; }
                        h1, h2 { text-align: center; }
                    </style>
                </head>
                <body>
                    <h1>${title}</h1>
                    ${el.innerHTML}
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }
};

export default ExportService;
