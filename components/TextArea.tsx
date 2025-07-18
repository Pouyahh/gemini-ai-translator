
import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  // no custom props needed yet
}

const TextArea: React.FC<TextAreaProps> = (props) => {
  return (
    <textarea
      {...props}
      className="w-full h-48 flex-grow bg-transparent text-gray-200 p-4 resize-none focus:outline-none placeholder-gray-500 text-base"
      maxLength={5000}
    />
  );
};

export default TextArea;
