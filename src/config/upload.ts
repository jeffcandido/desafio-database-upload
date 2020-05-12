import crypto from 'crypto';
import multer from 'multer';
import path from 'path';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  directory: tmpFolder,
  storage: multer.diskStorage({
    destination: tmpFolder,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('HEX');
      const filenName = `${fileHash}-${file.originalname}`;

      return callback(null, filenName);
    },
  }),
};
