function extractBuyGet(str) {
    const numbers = str.match(/\d+/g);
    return {
        buy: numbers ? parseInt(numbers[0], 10) : null,
        get: numbers ? parseInt(numbers[1], 10) : null
    };
}

export { extractBuyGet };