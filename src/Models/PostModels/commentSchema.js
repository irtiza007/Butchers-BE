import { Schema, model } from 'mongoose';

const commentSchema = new Schema(
	{
		message: String,
		postBy: { type: Schema.Types.ObjectId, ref: 'User' },
		postId: { type: Schema.Types.ObjectId, ref: 'Posts' },
		replies: [
			{
				message: {
					type: String,
					required: true,
				},
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

export default model('Comments', commentSchema);
