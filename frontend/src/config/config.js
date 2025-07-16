function extractBuyGet(str) {
    const numbers = str.match(/\d+/g);
    return {
        buy: numbers ? parseInt(numbers[0], 10) : null,
        get: numbers ? parseInt(numbers[1], 10) : null
    };
}

// Parse custitem38 to get matrix type and options
function getMatrixInfo(matrixOptions) {
    if (matrixOptions.length === 0) return { matrixType: '', options: [] };

    try {
        // Get the first item to determine the matrix type
        const firstItem = matrixOptions[0];
        if (firstItem.custitem38) {
            // Parse as JavaScript object string (not JSON)
            const objectString = firstItem.custitem38.replace(/'/g, '"'); // Replace single quotes with double quotes
            const parsed = JSON.parse(objectString);
            const matrixType = Object.keys(parsed)[0]; // e.g., "Shade"

            const options = matrixOptions.map((item) => {
                try {
                    const itemObjectString = item.custitem38.replace(/'/g, '"');
                    const itemParsed = JSON.parse(itemObjectString);
                    const value = itemParsed[matrixType]; // e.g., "Shade A2"
                    return {
                        value: item.id,
                        label: value || item.itemid,
                    };
                } catch {
                    return {
                        value: item.id,
                        label: item.itemid,
                    };
                }
            });

            return { matrixType, options };
        }
    } catch {
        // Fallback if parsing fails
    }

    return {
        matrixType: 'Options',
        options: matrixOptions.map((item) => ({
            value: item.id,
            label: item.custitem38 || item.itemid,
        }))
    };
}

export { extractBuyGet, getMatrixInfo };