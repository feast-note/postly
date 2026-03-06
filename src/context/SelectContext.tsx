"use client";

import { createContext, useContext, ReactNode, useState } from "react";

interface SelectContextType {
  selected: string | null;
  onSelect: (id: string | null) => void;
}

const SelectModeContext = createContext<SelectContextType | null>({
  selected: null,
  onSelect: () => {},
});

export function SelectProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<string | null>(null);
  const onSelect = (id: string | null) => setSelected(id);

  return (
    <SelectModeContext.Provider value={{ selected, onSelect }}>
      {children}
    </SelectModeContext.Provider>
  );
}

export const useSelect = () => {
  const context = useContext(SelectModeContext);
  if (!context) throw new Error("DragModeProvider 내에서 사용해주세요.");
  return context;
};
