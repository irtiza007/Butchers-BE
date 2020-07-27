import { Schema, model } from 'mongoose';

const ChatSchema = new Schema(
	{
		messageBy: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		messageTo: { type: Schema.Types.ObjectId, ref: 'User' },
		date: { type: Date, default: Date.now() },
		message: String,
	},
	{
		timestamps: true,
	},
);

export default model('Chat', ChatSchema);
