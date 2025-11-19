import React from 'react';
import Button from "@/components/ui/Button";
import ModalInput from './ModalInput';
import type {PostType} from "@/shared/types";

interface Props {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  post?: Omit<PostType, "id" | "createdAt" | "updatedAt" | "author" | "userId">;
  setIsModalOpen: (isOpen: boolean) => void;
  event: "Edit" | "Create";
  loading?: boolean;
}

const Form = ({ handleSubmit, handleChange, post, setIsModalOpen, event, loading }: Props) => {
  return (
    <form onSubmit={handleSubmit} className={"flex flex-col gap-3"}>
      <ModalInput handleChange={handleChange} fieldName={"Title"} inputName={"title"} value={post?.title} />
      <ModalInput handleChange={handleChange} fieldName={"Subtitle"} inputName={"subtitle"} value={post?.subtitle} />
      <ModalInput handleChange={handleChange} fieldName={"Description"} inputName={"description"} value={post?.description} />
      <ModalInput handleChange={handleChange} fieldName={"Category"} inputName={"category"} value={post?.category} />
      <ModalInput handleChange={handleChange} fieldName={"Post image URL"} inputName={"image"} value={post?.image} />
      <div className="flex gap-5 justify-end mt-3">
        <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
        <Button htmlType="submit" type="primary" loading={loading}>{event}</Button>
      </div>
    </form>
  );
};

export default Form;