// src/config.js
import axios from "axios";

function extractBuyGet(str) {
  const numbers = str.match(/\d+/g);
  return {
    buy: numbers ? parseInt(numbers[0], 10) : null,
    get: numbers ? parseInt(numbers[1], 10) : null,
  };
}

function getMatrixInfo(matrixOptions) {
  if (matrixOptions.length === 0) return { matrixType: '', options: [] };

  try {
    const firstItem = matrixOptions[0];
    if (firstItem.custitem38) {
      const objectString = firstItem.custitem38.replace(/'/g, '"');
      const parsed = JSON.parse(objectString);
      const matrixType = Object.keys(parsed)[0];

      const options = matrixOptions.map((item) => {
        try {
          const itemObjectString = item.custitem38.replace(/'/g, '"');
          const itemParsed = JSON.parse(itemObjectString);
          const value = itemParsed[matrixType];
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
  } catch {}

  return {
    matrixType: "Options",
    options: matrixOptions.map((item) => ({
      value: item.id,
      label: item.custitem38 || item.itemid,
    })),
  };
}

// NEW FUNCTION to fetch region from postal code
async function fetchRegionByPostalCode(postalCode) {
  try {
    const cleanPostal = postalCode.replace(/\s/g, "").toUpperCase(); // clean it
    const response = await axios.get(`https://api.zippopotam.us/ca/${cleanPostal}`);
    console.log("✅ Zippopotam API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Failed to fetch region info:", error);
    return null;
  }
}

export { extractBuyGet, getMatrixInfo, fetchRegionByPostalCode };
