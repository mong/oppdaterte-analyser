import { PropsWithChildren } from 'react';

const sizes = {
  "x-small": "max-w-[565px]",
  small: "max-w-[708px]",
  medium: "max-w-[954px]",
  large: "max-w-[1196px]"
}

interface MaxWithProps {
  size: keyof typeof sizes;
}

export const MaxWidth = ({ size, children }: PropsWithChildren<MaxWithProps>) => {
  return (
    <div className="flex justify-center w-full">
      <div className={`w-full ${sizes[size]}`}>
        {children}
      </div>
    </div>
  );
};