import { Schema, model } from 'mongoose';

const postSchema = new Schema(
	{
		message: String,
		name: String,
		postBy: { type: Schema.Types.ObjectId, ref: 'User' },
	},
	{
		timestamps: true,
	},
);

export default model('posts', postSchema);
