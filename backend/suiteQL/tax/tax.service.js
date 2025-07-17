class TaxService {
    constructor() {
        // Tax rates by province/state (example rates - update with actual rates)
        this.taxRates = {
            'ca': {
                'ON': { gst: 0.05, pst: 0.08, hst: 0.13, total: 0.13 },
                'QC': { gst: 0.05, pst: 0.09975, hst: 0.14975, total: 0.14975 },
                'BC': { gst: 0.05, pst: 0.07, hst: 0.12, total: 0.12 },
                'AB': { gst: 0.05, pst: 0.00, hst: 0.05, total: 0.05 },
                'SK': { gst: 0.05, pst: 0.06, hst: 0.11, total: 0.11 },
                'MB': { gst: 0.05, pst: 0.07, hst: 0.12, total: 0.12 },
                'NB': { gst: 0.00, pst: 0.00, hst: 0.15, total: 0.15 },
                'NS': { gst: 0.00, pst: 0.00, hst: 0.15, total: 0.15 },
                'PE': { gst: 0.00, pst: 0.00, hst: 0.15, total: 0.15 },
                'NL': { gst: 0.00, pst: 0.00, hst: 0.15, total: 0.15 },
                'YT': { gst: 0.05, pst: 0.00, hst: 0.05, total: 0.05 },
                'NT': { gst: 0.05, pst: 0.00, hst: 0.05, total: 0.05 },
                'NU': { gst: 0.05, pst: 0.00, hst: 0.05, total: 0.05 }
            },
            'us': {
                'AL': { state: 0.04, local: 0.05, total: 0.09 },
                'AK': { state: 0.00, local: 0.017, total: 0.017 },
                'AZ': { state: 0.056, local: 0.027, total: 0.083 },
                'AR': { state: 0.065, local: 0.029, total: 0.094 },
                'CA': { state: 0.0725, local: 0.0275, total: 0.10 },
                'CO': { state: 0.029, local: 0.049, total: 0.078 },
                'CT': { state: 0.0635, local: 0.0, total: 0.0635 },
                'DE': { state: 0.0, local: 0.0, total: 0.0 },
                'FL': { state: 0.06, local: 0.012, total: 0.072 },
                'GA': { state: 0.04, local: 0.033, total: 0.073 },
                'HI': { state: 0.04, local: 0.005, total: 0.045 },
                'ID': { state: 0.06, local: 0.003, total: 0.063 },
                'IL': { state: 0.0625, local: 0.0265, total: 0.089 },
                'IN': { state: 0.07, local: 0.0, total: 0.07 },
                'IA': { state: 0.06, local: 0.008, total: 0.068 },
                'KS': { state: 0.065, local: 0.021, total: 0.086 },
                'KY': { state: 0.06, local: 0.0, total: 0.06 },
                'LA': { state: 0.0445, local: 0.051, total: 0.0955 },
                'ME': { state: 0.055, local: 0.0, total: 0.055 },
                'MD': { state: 0.06, local: 0.0, total: 0.06 },
                'MA': { state: 0.0625, local: 0.0, total: 0.0625 },
                'MI': { state: 0.06, local: 0.0, total: 0.06 },
                'MN': { state: 0.06875, local: 0.0055, total: 0.074 },
                'MS': { state: 0.07, local: 0.0007, total: 0.0707 },
                'MO': { state: 0.04225, local: 0.0395, total: 0.082 },
                'MT': { state: 0.0, local: 0.0, total: 0.0 },
                'NE': { state: 0.055, local: 0.0145, total: 0.0695 },
                'NV': { state: 0.0685, local: 0.0125, total: 0.081 },
                'NH': { state: 0.0, local: 0.0, total: 0.0 },
                'NJ': { state: 0.06625, local: 0.0, total: 0.06625 },
                'NM': { state: 0.05125, local: 0.027, total: 0.078 },
                'NY': { state: 0.08, local: 0.048, total: 0.128 },
                'NC': { state: 0.0475, local: 0.023, total: 0.0705 },
                'ND': { state: 0.05, local: 0.0175, total: 0.0675 },
                'OH': { state: 0.0575, local: 0.0145, total: 0.072 },
                'OK': { state: 0.045, local: 0.044, total: 0.089 },
                'OR': { state: 0.0, local: 0.0025, total: 0.0025 },
                'PA': { state: 0.06, local: 0.0034, total: 0.0634 },
                'RI': { state: 0.07, local: 0.0, total: 0.07 },
                'SC': { state: 0.06, local: 0.0143, total: 0.0743 },
                'SD': { state: 0.045, local: 0.0195, total: 0.0645 },
                'TN': { state: 0.07, local: 0.0275, total: 0.0975 },
                'TX': { state: 0.0625, local: 0.0195, total: 0.082 },
                'UT': { state: 0.061, local: 0.0115, total: 0.0725 },
                'VT': { state: 0.06, local: 0.0018, total: 0.0618 },
                'VA': { state: 0.0575, local: 0.0008, total: 0.0583 },
                'WA': { state: 0.065, local: 0.0275, total: 0.0925 },
                'WV': { state: 0.06, local: 0.0065, total: 0.0665 },
                'WI': { state: 0.05, local: 0.0044, total: 0.0544 },
                'WY': { state: 0.04, local: 0.0155, total: 0.0555 }
            }
        };

        // Province/State name to code mapping
        this.provinceMapping = {
            'ca': {
                'ontario': 'ON',
                'quebec': 'QC',
                'british columbia': 'BC',
                'alberta': 'AB',
                'saskatchewan': 'SK',
                'manitoba': 'MB',
                'new brunswick': 'NB',
                'nova scotia': 'NS',
                'prince edward island': 'PE',
                'newfoundland and labrador': 'NL',
                'yukon': 'YT',
                'northwest territories': 'NT',
                'nunavut': 'NU'
            },
            'us': {
                'alabama': 'AL',
                'alaska': 'AK',
                'arizona': 'AZ',
                'arkansas': 'AR',
                'california': 'CA',
                'colorado': 'CO',
                'connecticut': 'CT',
                'delaware': 'DE',
                'florida': 'FL',
                'georgia': 'GA',
                'hawaii': 'HI',
                'idaho': 'ID',
                'illinois': 'IL',
                'indiana': 'IN',
                'iowa': 'IA',
                'kansas': 'KS',
                'kentucky': 'KY',
                'louisiana': 'LA',
                'maine': 'ME',
                'maryland': 'MD',
                'massachusetts': 'MA',
                'michigan': 'MI',
                'minnesota': 'MN',
                'mississippi': 'MS',
                'missouri': 'MO',
                'montana': 'MT',
                'nebraska': 'NE',
                'nevada': 'NV',
                'new hampshire': 'NH',
                'new jersey': 'NJ',
                'new mexico': 'NM',
                'new york': 'NY',
                'north carolina': 'NC',
                'north dakota': 'ND',
                'ohio': 'OH',
                'oklahoma': 'OK',
                'oregon': 'OR',
                'pennsylvania': 'PA',
                'rhode island': 'RI',
                'south carolina': 'SC',
                'south dakota': 'SD',
                'tennessee': 'TN',
                'texas': 'TX',
                'utah': 'UT',
                'vermont': 'VT',
                'virginia': 'VA',
                'washington': 'WA',
                'west virginia': 'WV',
                'wisconsin': 'WI',
                'wyoming': 'WY'
            }
        };
    }

    // Get tax rates by location
    async getTaxRatesByLocation(country, province, city) {
        try {
            const countryRates = this.taxRates[country.toLowerCase()];
            if (!countryRates) {
                return { error: 'Country not supported' };
            }

            // Convert province name to code if needed
            const provinceCode = this.convertProvinceNameToCode(country, province);
            if (!provinceCode) {
                return { error: 'Province/State is required' };
            }

            const provinceRates = countryRates[provinceCode];
            if (!provinceRates) {
                return { error: 'Province/State not found' };
            }

            return {
                success: true,
                country: country.toUpperCase(),
                province: provinceCode,
                city: city || null,
                rates: provinceRates
            };
        } catch (error) {
            return { error: 'Failed to get tax rates' };
        }
    }

    // Get tax rates by postal code (requires location lookup first)
    async getTaxRatesByPostalCode(country, postalCode) {
        try {
            // This would typically integrate with a postal code service
            // For now, return a default response
            return {
                success: true,
                country: country.toUpperCase(),
                postalCode: postalCode.toUpperCase(),
                message: 'Postal code lookup not implemented yet. Please use province/state lookup.'
            };
        } catch (error) {
            return { error: 'Failed to get tax rates by postal code' };
        }
    }

    // Calculate tax for cart items
    async calculateCartTax(items, country, province, city, postalCode) {
        try {
            // Get tax rates for the location
            const taxRates = await this.getTaxRatesByLocation(country, province, city);

            if (taxRates.error) {
                return taxRates;
            }

            // Calculate subtotal
            const subtotal = items.reduce((sum, item) => {
                const price = item.price || item.unitprice || 0;
                const quantity = item.quantity || 1;
                return sum + (price * quantity);
            }, 0);

            // Calculate tax amounts
            const rates = taxRates.rates;
            let taxBreakdown = {};
            let totalTax = 0;

            if (country.toLowerCase() === 'ca') {
                // Canadian tax calculation
                if (rates.hst && rates.hst > 0) {
                    // HST provinces
                    taxBreakdown.hst = subtotal * rates.hst;
                    totalTax = taxBreakdown.hst;
                } else {
                    // GST + PST provinces
                    if (rates.gst) {
                        taxBreakdown.gst = subtotal * rates.gst;
                        totalTax += taxBreakdown.gst;
                    }
                    if (rates.pst) {
                        taxBreakdown.pst = subtotal * rates.pst;
                        totalTax += taxBreakdown.pst;
                    }
                }
            } else if (country.toLowerCase() === 'us') {
                // US tax calculation
                if (rates.state) {
                    taxBreakdown.state = subtotal * rates.state;
                    totalTax += taxBreakdown.state;
                }
                if (rates.local) {
                    taxBreakdown.local = subtotal * rates.local;
                    totalTax += taxBreakdown.local;
                }
            }

            const total = subtotal + totalTax;

            return {
                success: true,
                calculation: {
                    subtotal: Math.round(subtotal * 100) / 100,
                    taxBreakdown: Object.keys(taxBreakdown).reduce((acc, key) => {
                        acc[key] = Math.round(taxBreakdown[key] * 100) / 100;
                        return acc;
                    }, {}),
                    totalTax: Math.round(totalTax * 100) / 100,
                    total: Math.round(total * 100) / 100
                },
                location: {
                    country: country.toUpperCase(),
                    province: province?.toUpperCase(),
                    city: city || null,
                    postalCode: postalCode || null
                },
                rates: rates
            };
        } catch (error) {
            return { error: 'Failed to calculate tax' };
        }
    }

    // Helper method to convert province/state name to code
    convertProvinceNameToCode(country, provinceName) {
        if (!provinceName) return null;

        const countryMapping = this.provinceMapping[country.toLowerCase()];
        if (!countryMapping) return null;

        const normalizedName = provinceName.toLowerCase().trim();
        return countryMapping[normalizedName] || provinceName.toUpperCase();
    }
}

module.exports = new TaxService();
