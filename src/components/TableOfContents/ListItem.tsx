import React, { useState, useEffect } from "react";
import style from "./ListItem.module.css";

/**
 * Uses the IntersectionObserver API to watch the element with the given
 * `elementID` and set the `isVisible` state to true when the element is
 * visible in the viewport and false when it is not.
 *
 * @param {string} elementID The ID of the element to watch
 * @param {string} rootMargin The root margin to watch, see
 *   https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/rootMargin
 * @returns {boolean} True if the element is visible in the viewport, false
 *   otherwise
 */
export const useIntersectionByID = (elementID: string, rootMargin: string) => {
  const [isVisible, setVisibility] = useState<boolean>(false);

  useEffect(() => {
    const element = document.getElementById(elementID);
    if (!element) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisibility(entry.isIntersecting);
      },
      { rootMargin, threshold: 0.1 },
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    element && observer.observe(element);

    return () => observer.unobserve(element);
  }, [isVisible]);

  return isVisible;
};


type ListItemProps = {
  children?: React.ReactNode;
  expanded?: string;
  setExpanded?: React.Dispatch<React.SetStateAction<string>>;
  href: string;
  linkTitle: string;
  i?: string;
};

/**
 * A list item for the table of contents component.
 *
 * @param {ListItemProps} props The props for the list item.
 * @prop {React.ReactNode} [children] The children of the list item.
 * @prop {string} href The href of the link.
 * @prop {string} linkTitle The title of the link.
 * @prop {string} expanded The expanded state of the list item.
 * @prop {React.Dispatch<React.SetStateAction<string>>} setExpanded The function to set the expanded state.
 *
 * @returns The list item component.
 */
export const ListItem = ({
  children,
  href,
  linkTitle,
  expanded,
  setExpanded,
}: ListItemProps) => {
  const isVisbile = useIntersectionByID(href.replace("#", ""), "0px");

  return (
    <li
      className={`${style.tocListItem} ${isVisbile ? style.active : isVisbile}`}
    >
      <a
        href={href}
        onClick={() => {
          setExpanded((state) => (state === href ? "none" : href));
        }}
      >
        {linkTitle}
      </a>
      {(expanded === href || expanded === "all") && children}
    </li>
  );
};
