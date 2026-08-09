import mongoose, { Document, Schema } from "mongoose";

export interface IDocument extends Document {
  loanApplication: mongoose.Types.ObjectId;
  fileName: string;
  filePath: string;
  mimeType: string;
  sizeBytes: number;
  uploadedAt: Date;
}

const DocumentSchema = new Schema<IDocument>(
  {
    loanApplication: { type: Schema.Types.ObjectId, ref: "LoanApplication", required: true },
    fileName: { type: String, required: true },
    filePath: { type: String, required: true },
    mimeType: { type: String, required: true },
    sizeBytes: { type: Number, required: true },
    uploadedAt: { type: Date, default: Date.now },
  }
);

export default mongoose.model<IDocument>("Document", DocumentSchema);
