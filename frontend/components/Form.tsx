import React from 'react';
import Button from "@/components/ui/Button";
import ModalInput from './ModalInput';
import type { UpdatePostType } from "@/shared/types";

interface Props {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  post?: UpdatePostType;
  setIsModalOpen: (isOpen: boolean) => void;
  event: "Update" | "Create";
  loading?: boolean;
}

const Form = ({ handleSubmit, handleChange, post, setIsModalOpen, event, loading }: Props) => {
  return (
    <form onSubmit={handleSubmit} className={"flex flex-col gap-3"}>
      <ModalInput handleChange={handleChange} fieldName={"Title"} inputName={"title"} value={post?.title} />
      <ModalInput handleChange={handleChange} fieldName={"Subtitle"} inputName={"subtitle"} value={post?.subtitle} />
      <ModalInput handleChange={handleChange} fieldName={"Description"} inputName={"description"} value={post?.description} />
      <ModalInput handleChange={handleChange} fieldName={"Category"} inputName={"category"} value={post?.category} />
      <Button type={"link"} icon={"ImageUp"}>
        <label className={"cursor-pointer"}>
          Upload image for avatar
          <input type={"file"} name={"image"} accept={"image/*"} onChange={handleChange} />
        </label>
      </Button>

      <div className="flex gap-5 justify-end mt-3">
        <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
        <Button htmlType="submit" type="primary" loading={loading}>{event}</Button>
      </div>
    </form>
  );
};

export default Form;