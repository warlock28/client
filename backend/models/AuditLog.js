import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  // Admin who performed the action
  adminId: {
    type: String,
    required: true
  },
  adminEmail: {
    type: String,
    required: true
  },
  
  // Action details
  action: {
    type: String,
    required: true,
    enum: [
      'CREATE_INSTRUCTOR',
      'UPDATE_INSTRUCTOR',
      'DELETE_INSTRUCTOR',
      'LOGIN',
      'CHANGE_AVAILABILITY',
      'VIEW_DASHBOARD',
      'VIEW_AUDIT_LOGS'
    ]
  },
  
  // Target information
  targetType: {
    type: String,
    required: true,
    enum: ['INSTRUCTOR', 'SYSTEM', 'USER', 'APPOINTMENT']
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false // Some actions might not have a specific target
  },
  targetName: {
    type: String,
    required: false
  },
  
  // Additional details
  details: {
    type: String,
    required: true
  },
  
  // Request metadata
  ipAddress: {
    type: String,
    required: false
  },
  userAgent: {
    type: String,
    required: false
  },
  
  // Timestamp
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Indexes for better query performance
auditLogSchema.index({ adminId: 1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ targetType: 1 });
auditLogSchema.index({ timestamp: -1 });

// Compound index for common queries
auditLogSchema.index({ action: 1, timestamp: -1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

export default AuditLog;
