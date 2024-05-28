import { Injectable } from "@nestjs/common";
import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app';
import { getStorage, } from 'firebase-admin/storage';
import * as serviceAccount from './serviceAccount.json';

@Injectable()
export class FirebaseService {
    private bucket: any;

    constructor() {
        initializeApp({
            credential: cert(serviceAccount as ServiceAccount),
            storageBucket: 'dreambook-6dd6e.appspot.com',
        });
        this.bucket = getStorage().bucket();
    }

    async uploadFile(
        file: Express.Multer.File
    ) {
        const fileName = `${Date.now()}-${file.originalname}`;
        const buffer = file.buffer;

        // Save file to the bucket
        await this.bucket.file(fileName).save(buffer, {
            resumable: true,
            metadata: {
                contentType: file.mimetype,
            },
        });

        // Make the file publicly accessible
        await this.bucket.file(fileName).makePublic();

        // Construct public URL
        const publicUrl = `https://storage.googleapis.com/${this.bucket.name}/${fileName}`;

        return publicUrl;
    }

    async deleteFile(
        fileUrl: string
    ) {
        const fileName = fileUrl.split('/').pop();
        console.log(fileName);
        // Save file to the bucket
        await this.bucket.file(fileName).delete();
    }
}