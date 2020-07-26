import fs from 'fs';

const deleteImage = (filePath, res, next) => {
	fs.unlink(filePath, err => {
		if (err && err.code == 'ENOENT') {
			next(true);
		} else if (err) {
			// other errors, e.g. maybe we don't have enough permission
			res
				.status(500)
				.send(
					new Error(
						`Error occurred while trying to remove file. coz we have no permissions`,
					),
				);
		} else {
			next(true);
		}
	});
};

export default { deleteImage };

// const deleteImageTest = (req, res, next) => {
// 	fs.unlink('public\\1595703145126irtiza.jpg', err => {
// 		if (err && err.code == 'ENOENT') {
// 			// file doens't exist
// 			res.status(404);
// 			next(new Error(`File doesn't exist, won't remove it.`));
// 		} else if (err) {
// 			// other errors, e.g. maybe we don't have enough permission

// 			res.status(500);
// 			next(
// 				new Error(
// 					`Error occurred while trying to remove file. coz we have no permissions`,
// 				),
// 			);
// 		} else {
// 			return res.status(200).send({
// 				Message: 'Picture Deleted Successfully.',
// 			});
// 		}
// 	});
// };
