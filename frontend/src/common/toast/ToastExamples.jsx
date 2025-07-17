// Example usage of Toast notifications
import { Toast, success, error, loading, promise } from "common";

// Basic usage examples
const ExampleComponent = () => {
  // 1. Simple success toast
  const handleSuccess = () => {
    Toast.success("Item added to cart successfully!");
    // or
    success("Item added to cart successfully!");
  };

  // 2. Error toast
  const handleError = () => {
    Toast.error("Failed to add item to cart");
    // or
    error("Failed to add item to cart");
  };

  // 3. Loading toast
  const handleLoading = () => {
    const toastId = Toast.loading("Adding item to cart...");

    // Simulate async operation
    setTimeout(() => {
      Toast.update(toastId, {
        render: "Item added successfully!",
        type: "success",
        isLoading: false,
      });
    }, 2000);
  };

  // 4. Promise-based toast (recommended for async operations)
  const handlePromiseToast = async () => {
    const addToCartPromise = new Promise((resolve, reject) => {
      // Simulate API call
      setTimeout(() => {
        const success = Math.random() > 0.3;
        if (success) {
          resolve("Item added to cart!");
        } else {
          reject(new Error("Failed to add item"));
        }
      }, 2000);
    });

    Toast.promise(addToCartPromise, {
      loading: "Adding item to cart...",
      success: "Item added successfully!",
      error: "Failed to add item to cart",
    });
  };

  // 5. Cart-specific toast
  const handleCartSuccess = () => {
    Toast.cartSuccess("🛒 Item added to cart!");
  };

  // 6. Promotion toast
  const handlePromotion = () => {
    Toast.promotion("🎉 Buy 3 Get 3 promotion applied!");
  };

  // 7. API error handling
  const handleApiError = async () => {
    try {
      // Simulate API call that fails
      throw new Error("Network error");
    } catch (error) {
      Toast.apiError(error, "Custom error message");
    }
  };

  // 8. Validation error
  const handleValidation = () => {
    Toast.validationError("Please fill in all required fields");
  };

  // 9. Custom toast with options
  const handleCustom = () => {
    Toast.success("Custom success message", {
      position: "bottom-right",
      autoClose: 8000,
      hideProgressBar: true,
    });
  };

  return (
    <div>
      <h2>Toast Examples</h2>
      <button onClick={handleSuccess}>Success Toast</button>
      <button onClick={handleError}>Error Toast</button>
      <button onClick={handleLoading}>Loading Toast</button>
      <button onClick={handlePromiseToast}>Promise Toast</button>
      <button onClick={handleCartSuccess}>Cart Success</button>
      <button onClick={handlePromotion}>Promotion Toast</button>
      <button onClick={handleApiError}>API Error</button>
      <button onClick={handleValidation}>Validation Error</button>
      <button onClick={handleCustom}>Custom Toast</button>
    </div>
  );
};

// Real-world usage examples:

// In ProductDetail component
const handleAddToCart = async () => {
  const toastId = Toast.loading("Adding item to cart...");

  try {
    const cartItem = { ...product, quantity: Number(actualQuantity) };
    await dispatch(addToCart(cartItem));

    // Show success with promotion info
    const { buy, get } = buyGetPromotion;
    if (buy && get && quantity >= buy) {
      const bonusItems = actualQuantity - quantity;
      Toast.update(toastId, {
        render: `🎉 Added ${quantity} items + ${bonusItems} bonus items to cart!`,
        type: "success",
        isLoading: false,
      });
    } else {
      Toast.update(toastId, {
        render: `✅ Added ${actualQuantity} ${product.itemid} to cart!`,
        type: "success",
        isLoading: false,
      });
    }
  } catch (error) {
    Toast.update(toastId, {
      render: "Failed to add item to cart",
      type: "error",
      isLoading: false,
    });
  }
};

// In Cart component for quantity changes
const handleQuantityChange = (item, action) => {
  if (action === "dec" && item.quantity === 1) {
    Toast.info(`🗑️ Removed ${item.itemid} from cart`);
  } else if (action === "inc") {
    Toast.success(`📈 Increased quantity for ${item.itemid}`);
  }
};

// In Order component
const handlePlaceOrder = async () => {
  const orderPromise = placeOrder(orderData);

  Toast.promise(orderPromise, {
    loading: "Placing your order...",
    success: "🎉 Order placed successfully!",
    error: "Failed to place order. Please try again.",
  });
};

export default ExampleComponent;
