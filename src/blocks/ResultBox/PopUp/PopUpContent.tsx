import { AiOutlineClose } from "react-icons/ai";
import { useTransition, animated, easings } from "react-spring";

import classNames from "./PopUp.module.css";


import React, { useRef } from "react";

/**
 * Registers an event listener for the given keys on the given target element.
 *
 * Will only call the handler if the event is triggered by one of the keys in the given array.
 *
 * @param key The keys to listen for
 * @param eventName The event name to listen for (e.g. 'keydown', 'keyup')
 * @param handler The function to call when the event is triggered
 * @param targetElement The element to listen on. Defaults to the global object (window in a browser)
 */
export const useKeys = (
  key: string[],
  eventName: string,
  handler: (event: KeyboardEvent) => void,
  targetElement = global,
) => {
  const listenerRef = useRef<(event: KeyboardEvent) => void>(undefined);

  React.useEffect(() => {
    listenerRef.current = handler;
  }, [handler]);

  React.useEffect(() => {
    if (!listenerRef.current) return;
    const isSupported = targetElement && targetElement.addEventListener;
    if (!isSupported) return;
    const eventListener = (event: KeyboardEvent) =>
      listenerRef.current &&
      key.includes(event.key) &&
      listenerRef.current(event);
    targetElement.addEventListener(eventName, eventListener);
    return () => {
      targetElement.removeEventListener(eventName, eventListener);
    };
  }, [eventName, targetElement]);
};


/**
 * useOnClickOutside hook. Returns a ref that should be passed to the element
 * that should trigger the on click outside event. The hook will call the
 * `handler` function when the element is clicked outside of.
 * @param {() => void} handler - The function to call when the element is clicked outside of.
 * @param {boolean} active - Whether the effect should be active or not.
 * @returns {React.MutableRefObject<T>} - The ref that should be passed to the element.
 */
export const useOnClickOutside = <T extends Element>(
  handler: () => void,
  active: boolean,
) => {
  const ref = React.useRef<T>(undefined);

  React.useEffect(() => {
    const clickHandler = (event) => {
      if (!ref.current) return;
      if (!ref.current.contains(event.target)) {
        handler();
      }
    };
    if (active) {
      document.addEventListener("mousedown", clickHandler);
    }
    return () => {
      document.removeEventListener("mousedown", clickHandler);
    };
  }, [active]);

  return ref;
};


type PopUpContentProps = {
  children: React.ReactNode;
  active: boolean;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
  innerContentStyle?: React.CSSProperties;
};

export const PopUpContent = ({
  children,
  active,
  setActive,
  innerContentStyle = {
    width: "100%",
    height: "100%",
    margin: "auto",
    padding: 0,
  },
}: PopUpContentProps) => {
  const ref = useOnClickOutside<HTMLDivElement>(() => setActive(false), active);

  const transitions = useTransition(active, {
    from: { background: "rgba(172, 181, 189, 0)", transform: "scale(0.95)" },
    enter: { background: "rgba(172, 181, 189, 0.5)", transform: "scale(1)" },
    leave: { background: "rgba(172, 181, 189, 0)", transform: "scale(0.95)" },
    config: (it, ind, state) => ({
      easing: state === "leave" ? easings.easeInQuad : easings.easeOutQuad,
      duration: state === "leave" ? 75 : 100,
    }),
  });
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.defaultPrevented) return;
    setActive(false);
    event.preventDefault();
  };
  useKeys(["Escape", "Esc"], "keydown", handleKeyDown);
  return (
    <>
      {transitions(
        (styles, item) =>
          item && (
            <animated.div
              className={classNames.popUpContentWrapper}
              style={{
                ...styles,
              }}
            >
              <div
                className={classNames.popUpContent}
                ref={ref}
                style={innerContentStyle}
                data-testid="popUpContent"
              >
                <button
                  className={classNames.closeBtn}
                  data-testid="closeBtn"
                  onClick={() => setActive(false)}
                >
                  <AiOutlineClose
                    strokeWidth={"0.0625rem"}
                    color="#034584"
                    style={{ alignSelf: "end" }}
                    size={30}
                  />
                </button>
                {children}
              </div>
            </animated.div>
          ),
      )}
    </>
  );
};
