"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import styles from "./Editable.module.css";

// Wraps a region of the real (public) design in admin routes: hover/focus shows an outline
// and an edit chip; clicking it reveals `editor` right below the region. The wrapped
// presentation component is unchanged — editing is added from the outside (CLAUDE.md §7C).

type EditableContextValue = { close: () => void };
const EditableContext = createContext<EditableContextValue | null>(null);

export function useEditable(): EditableContextValue {
  const context = useContext(EditableContext);
  if (!context) throw new Error("useEditable must be used inside <Editable>");
  return context;
}

type Props = {
  label: string;      // what is edited, e.g. "푸터 문구"
  editor: ReactNode;  // client editor element; closes itself via useEditable()
  children: ReactNode;
};

export default function Editable({ label, editor, children }: Props) {
  const [editing, setEditing] = useState(false);

  return (
    <div className={`${styles.region} ${editing ? styles.editing : ""}`}>
      {children}
      {!editing && (
        <button type="button" className={styles.chip} onClick={() => setEditing(true)} aria-label={`${label} 수정`}>
          수정
        </button>
      )}
      {editing && (
        <EditableContext.Provider value={{ close: () => setEditing(false) }}>
          <div className={styles.editor}>{editor}</div>
        </EditableContext.Provider>
      )}
    </div>
  );
}
