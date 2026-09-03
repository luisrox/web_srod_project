"use client";

import { createContext, useContext, type ReactNode } from "react";

const ContactModalContext = createContext<() => void>(() => undefined);

export function ContactModalProvider({
  children,
  onOpen,
}: {
  children: ReactNode;
  onOpen: () => void;
}) {
  return (
    <ContactModalContext.Provider value={onOpen}>
      {children}
    </ContactModalContext.Provider>
  );
}

export function useOpenContact() {
  return useContext(ContactModalContext);
}
