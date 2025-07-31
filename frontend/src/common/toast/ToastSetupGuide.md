# Toast Notification Setup Guide

## 1. Setup in App.js

Add the ToastProvider to your main App component:

```jsx
import React from 'react';
import { ToastProvider } from 'common';
// ... other imports

function App() {
  return (
    <ToastProvider>
      <div className="App">
        {/* Your existing app content */}
        <Router>
          <Routes>
            {/* Your routes */}
          </Routes>
        </Router>
      </div>
    </ToastProvider>
  );
}

export default App;
```

## 2. Usage Examples

### Basic Usage
```jsx
import { Toast } from 'common';

// Success toast
Toast.success("Item added to cart!");

// Error toast
Toast.error("Failed to add item to cart");

// Warning toast
Toast.warning("Please check your input");

// Info toast
Toast.info("Processing your request...");
```

### Advanced Usage
```jsx
// Loading toast with update
const toastId = Toast.loading("Adding item to cart...");

// Later update the same toast
Toast.update(toastId, {
  render: "Item added successfully!",
  type: "success",
  isLoading: false,
});

// Promise-based toast (recommended for async operations)
Toast.promise(
  apiCall(),
  {
    loading: "Loading...",
    success: "Success!",
    error: "Error occurred!",
  }
);
```

### Cart-Specific Toasts
```jsx
// Cart success with icon
Toast.cartSuccess("🛒 Item added to cart!");

// Promotion toast
Toast.promotion("🎉 Buy 3 Get 3 promotion applied!");

// Order success
Toast.orderSuccess("✅ Order placed successfully!");
```

### Error Handling
```jsx
try {
  // API call
} catch (error) {
  // Automatic error message extraction
  Toast.apiError(error, "Custom error message");
}
```

## 3. Components with Toast Integration

### ProductDetail Component
- ✅ Shows promotion-specific toasts when Buy X Get Y is applied
- ✅ Shows regular cart success toasts for normal additions
- ✅ Displays bonus item information in notifications

### ListProduct Component
- ✅ Uses reusable quantity handlers with Buy X Get Y logic
- ✅ Shows promotion preview when bonus items are available
- ✅ Ready for toast integration in handleAddToCart

### Cart Components
- Ready for toast integration on quantity changes
- Can show removal notifications
- Can show stock limit warnings

## 4. Customization

### Custom Toast Options
```jsx
Toast.success("Custom message", {
  position: "bottom-right",
  autoClose: 8000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
});
```

### Custom Styling
The Toast.css file provides custom styling. You can modify:
- Colors for different toast types
- Border styles
- Typography
- Mobile responsiveness

## 5. Best Practices

1. **Use specific toast types**:
   - `Toast.cartSuccess()` for cart operations
   - `Toast.promotion()` for promotions
   - `Toast.apiError()` for API errors

2. **Use promise-based toasts for async operations**:
   ```jsx
   Toast.promise(asyncOperation, {
     loading: "Processing...",
     success: "Done!",
     error: "Failed!",
   });
   ```

3. **Provide meaningful messages**:
   ```jsx
   // Good
   Toast.success("Added 3 items + 3 bonus items to cart!");
   
   // Bad
   Toast.success("Success!");
   ```

4. **Handle errors gracefully**:
   ```jsx
   Toast.apiError(error, "Failed to add item. Please try again.");
   ```

## 6. Available Methods

- `Toast.success(message, options)`
- `Toast.error(message, options)`
- `Toast.warning(message, options)`
- `Toast.info(message, options)`
- `Toast.loading(message, options)`
- `Toast.update(toastId, options)`
- `Toast.promise(promise, messages, options)`
- `Toast.cartSuccess(message, options)`
- `Toast.promotion(message, options)`
- `Toast.orderSuccess(message, options)`
- `Toast.apiError(error, customMessage)`
- `Toast.networkError()`
- `Toast.validationError(message)`
- `Toast.dismiss(toastId)`
- `Toast.dismissAll()`

## 7. Integration Checklist

- [ ] Add ToastProvider to App.js
- [ ] Import Toast in components that need notifications
- [ ] Replace alert() calls with Toast notifications
- [ ] Add loading states for async operations
- [ ] Implement proper error handling
- [ ] Test on mobile devices
- [ ] Customize styling if needed

## 8. File Structure

```
src/
├── common/
│   ├── Toast.js          # Main toast utility
│   ├── ToastProvider.jsx # Provider component
│   ├── Toast.css         # Custom styling
│   ├── ToastExamples.jsx # Usage examples
│   └── index.js          # Exports
```
