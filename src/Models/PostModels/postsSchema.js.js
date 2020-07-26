import { Schema, model } from 'mongoose';

const postSchema = new Schema(
	{
		message: String,
		name: String,
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
