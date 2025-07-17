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

// Format price with proper rounding to 2 decimal places
function formatPrice(price) {
    // Handle null, undefined, or invalid values
    if (price === null || price === undefined || isNaN(price)) {
        return '0.00';
    }

    // Convert to number and format to 2 decimal places
    return Number(price).toFixed(2);
}

// Format price with currency symbol
function formatCurrency(price, currency = '$') {
    return `${currency}${formatPrice(price)}`;
}

// Calculate total price for quantity
function calculateTotalPrice(unitPrice, quantity) {
    if (!unitPrice || !quantity) return '0.00';

    const total = Number(unitPrice) * Number(quantity);
    return formatPrice(total);
}

// Calculate total price with currency symbol
function calculateTotalCurrency(unitPrice, quantity, currency = '$') {
    return `${currency}${calculateTotalPrice(unitPrice, quantity)}`;
}

// Calculate total price after discount based on promotions
async function getTotalPriceAfterDiscount(productId, unitPrice, quantity) {
    try {
        // Import api and endpoints here to avoid circular dependency
        const { default: api } = await import('../api/api.js');
        const { default: endpoint } = await import('../api/endpoints.js');

        // Fetch promotions for the product
        const promotionUrl = endpoint.GET_PROMOTIONS_BY_PRODUCT({
            productId
        });

        const response = await api.get(promotionUrl);
        const promotions = response.data;

        if (!promotions || promotions.length === 0) {
            return {
                originalPrice: Number(unitPrice) * Number(quantity),
                discountedPrice: Number(unitPrice) * Number(quantity),
                discount: 0,
                promotionApplied: null
            };
        }

        const originalTotal = Number(unitPrice) * Number(quantity);
        let bestDiscount = 0;
        let bestPromotion = null;

        // Check each promotion to find the best discount
        for (const promotion of promotions) {
            const { fixedprice, itemquantifier } = promotion;

            // Skip if promotion doesn't have required fields
            if (!fixedprice || !itemquantifier) continue;

            // Check if quantity meets the minimum requirement
            if (Number(quantity) >= Number(itemquantifier)) {
                // Calculate how many promotion sets can be applied
                const promotionSets = Math.floor(Number(quantity) / Number(itemquantifier));
                const remainingItems = Number(quantity) % Number(itemquantifier);

                // Calculate discounted price
                const discountedTotal = (promotionSets * Number(fixedprice)) + (remainingItems * Number(unitPrice));
                const discount = originalTotal - discountedTotal;

                // Keep track of best discount
                if (discount > bestDiscount) {
                    bestDiscount = discount;
                    bestPromotion = promotion;
                }
            }
        }

        return {
            originalPrice: originalTotal,
            discountedPrice: originalTotal - bestDiscount,
            discount: bestDiscount,
            promotionApplied: bestPromotion
        };

    } catch (error) {
        console.error('Error calculating discount:', error);
        // Return original price if error occurs
        const originalTotal = Number(unitPrice) * Number(quantity);
        return {
            originalPrice: originalTotal,
            discountedPrice: originalTotal,
            discount: 0,
            promotionApplied: null,
            error: error.message
        };
    }
}

// Postal code lookup function
async function fetchLocationByPostalCode(country, code) {
    if (!code || !code.trim()) {
        return {
            success: false,
            error: 'Postal code is required'
        };
    }

    try {
        const cleanCode = code.replace(/\s/g, '').toUpperCase();
        let apiUrl = '';

        switch (country) {
            case 'us':
                // US ZIP code (5 digits)
                if (!/^\d{5}$/.test(cleanCode)) {
                    return {
                        success: false,
                        error: 'Invalid US ZIP code format. Must be 5 digits.'
                    };
                }
                apiUrl = `https://api.zippopotam.us/us/${cleanCode}`;
                break;

            case 'ca':
                // Canadian postal code (first 3 characters: A1A format)
                if (!/^[A-Z]\d[A-Z]/.test(cleanCode)) {
                    return {
                        success: false,
                        error: 'Invalid Canadian postal code format. Must start with A1A format.'
                    };
                }
                const firstThree = cleanCode.slice(0, 3);
                apiUrl = `https://api.zippopotam.us/ca/${firstThree}`;
                break;

            default:
                return {
                    success: false,
                    error: 'Country not supported. Only "us" and "ca" are supported.'
                };
        }

        const response = await fetch(apiUrl);

        if (!response.ok) {
            return {
                success: false,
                error: `Postal code not found (${response.status})`
            };
        }

        const data = await response.json();

        if (data.places && data.places.length > 0) {
            return {
                success: true,
                data: {
                    city: data.places[0]['place name'],
                    province: data.places[0]['state abbreviation'],
                    state: data.places[0]['state abbreviation'], // Alias for province
                    country: data.country,
                    latitude: data.places[0]['latitude'],
                    longitude: data.places[0]['longitude']
                }
            };
        } else {
            return {
                success: false,
                error: 'No location data found'
            };
        }

    } catch (error) {
        return {
            success: false,
            error: error.message || 'Failed to fetch location data'
        };
    }
}

export {
    extractBuyGet,
    getMatrixInfo,
    formatPrice,
    formatCurrency,
    calculateTotalPrice,
    calculateTotalCurrency,
    getTotalPriceAfterDiscount,
    fetchLocationByPostalCode
};