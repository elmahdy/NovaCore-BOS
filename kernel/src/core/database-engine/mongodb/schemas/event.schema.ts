import { Schema } from 'mongoose';

export const EventSchema = new Schema({
  eventId: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  source: { type: String, required: true },
  target: { type: String },
  payload: { type: Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now },
  correlationId: { type: String },
  priority: { type: String, enum: ['low', 'medium', 'high', 'critical'] },
});
