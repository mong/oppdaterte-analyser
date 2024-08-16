import mongoose from "mongoose";

type ResultBoxProps = {
  boxId: mongoose.Types.ObjectId;
};

export default async function ResultBox({ boxId }: ResultBoxProps) {
  return <div>{boxId.toHexString()}</div>;
}
