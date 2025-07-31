// Test import file to verify Toast is working
import { Toast } from '../index.js';

// Test function to verify Toast is imported correctly
export function testToast() {
    console.log('Toast object:', Toast);
    console.log('Toast methods:', Object.getOwnPropertyNames(Toast));

    // Test if Toast methods are available
    if (Toast && typeof Toast.success === 'function') {
        console.log('✅ Toast.success is available');
        // Toast.success('Test message');
    } else {
        console.log('❌ Toast.success is NOT available');
    }
}

// Log the test immediately
testToast();
