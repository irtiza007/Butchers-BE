import { Schema, model } from 'mongoose';

const postSchema = new Schema(
	{
		message: { type: String, required: true },
		name: { type: String, required: true },
		imageUrl: { type: String, default: null },
		postBy: { type: Schema.Types.ObjectId, ref: 'User' },
		likes: [
			{
				userId: {
					type: Schema.Types.ObjectId,
					ref: 'User',
				},
				createdAt: {
					type: Date,
					default: Date.now(),
				},
			},
		],
	},
	{
		timestamps: true,
	},
);

export default model('Posts', postSchema);
