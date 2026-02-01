// Application Constants

const constants = {
  // User roles
  USER_ROLES: {
    USER: 'user',
    ADMIN: 'admin',
    DELIVERY: 'delivery',
  },

  // Order statuses
  ORDER_STATUS: {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    PREPARING: 'preparing',
    READY: 'ready',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
  },

  // Payment methods
  PAYMENT_METHOD: {
    CARD: 'card',
    UPI: 'upi',
    CASH: 'cash',
  },

  // Payment status
  PAYMENT_STATUS: {
    PENDING: 'pending',
    COMPLETED: 'completed',
    FAILED: 'failed',
  },

  // Discount types
  DISCOUNT_TYPE: {
    PERCENTAGE: 'percentage',
    FIXED: 'fixed',
  },

  // API Messages
  MESSAGES: {
    SUCCESS: 'Operation successful',
    ERROR: 'Operation failed',
    UNAUTHORIZED: 'Unauthorized access',
    NOT_FOUND: 'Resource not found',
    VALIDATION_ERROR: 'Validation error',
  },

  // API Status Codes
  STATUS_CODES: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_ERROR: 500,
  },
};

module.exports = constants;
