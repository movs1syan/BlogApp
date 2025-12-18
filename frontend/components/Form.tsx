import React from 'react';
import Button from "@/components/ui/Button";
import ModalInput from './ui/ModalInput';
import type { UpdatePostType } from "@/shared/types";
import {TriangleAlert} from "lucide-react";

interface Props {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  post?: UpdatePostType;
  setIsModalOpen: (isOpen: boolean) => void;
  event: "Update" | "Create";
  loading?: boolean;
  error?: string | null;
}

const Form = ({ handleSubmit, handleChange, post, setIsModalOpen, event, loading, error }: Props) => {
  return (
    <form onSubmit={handleSubmit} className={"flex flex-col gap-3"}>
      <ModalInput handleChange={handleChange} fieldName={"Title"} inputName={"title"} value={post?.title} />
      <ModalInput handleChange={handleChange} fieldName={"Subtitle"} inputName={"subtitle"} value={post?.subtitle} />
      <ModalInput handleChange={handleChange} fieldName={"Description"} inputName={"description"} value={post?.description} />
      <ModalInput handleChange={handleChange} fieldName={"Category"} inputName={"category"} value={post?.category} />
      <label className={"flex flex-col gap-2"}>
        Upload image for post
        <Button icon={"ImageUp"}>
          <input type={"file"} name={"image"} accept={"image/*"} onChange={handleChange} className={"cursor-pointer"} />
        </Button>
      </label>

      {error && (
        <div className={"flex justify-center items-center gap-2 text-red-600 mt-2"}>
          <TriangleAlert size={20} />
          <p className={"text-sm"}>{error}</p>
        </div>
      )}
      <div className="flex gap-5 justify-end mt-3">
        <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
        <Button htmlType="submit" type="primary" loading={loading}>{event}</Button>
      </div>
    </form>
  );
};

export default Form;