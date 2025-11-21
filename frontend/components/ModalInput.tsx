import React from 'react';

interface Props {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fieldName: string;
  inputName: string;
  value?: string | undefined;
}

const ModalInput = ({ handleChange, fieldName, inputName, value }: Props) => {
  return (
    <label>
      {fieldName}
      <input
        type={inputName === "image" ? "url" : inputName === "password" ? "password" : "text"}
        name={inputName}
        value={value}
        onChange={handleChange}
        className={"border-2 border-gray-200 rounded-lg py-1.5 px-4 mt-2 focus:outline-none focus:border-blue-700 w-full"} />
    </label>
  );
};

export default ModalInput;