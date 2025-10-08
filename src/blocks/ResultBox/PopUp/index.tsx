import React, { useEffect, useLayoutEffect } from "react";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;


import { PopUpButton } from "./PopUpButton";
import { PopUpContent } from "./PopUpContent";

type PopUpProps = {
  btnComponent: () => React.ReactNode;
  children: React.ReactNode;
  innerContentStyle?: React.CSSProperties;
  popupState?: React.Dispatch<React.SetStateAction<boolean>>;
};

export const PopUp = ({
  children,
  btnComponent,
  innerContentStyle,
  popupState,
}: PopUpProps) => {
  const [active, setActive] = React.useState<boolean>(false);

  useIsomorphicLayoutEffect(() => {
    if (popupState) {
      popupState(active);
    }
  }, [active]);
  return (
    <>
      <PopUpButton
        btnComponent={btnComponent}
        active={active}
        setActive={setActive}
      />
      {active && (
        <PopUpContent
          active={active}
          setActive={setActive}
          innerContentStyle={innerContentStyle}
        >
          {children}
        </PopUpContent>
      )}
    </>
  );
};
