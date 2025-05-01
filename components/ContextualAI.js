import React from "react";
import { css } from "../styled-system/css";

export default function ContextualAI() {
  return (
    <div className={styles.box}>
      <h3 className={styles.heading}>Konteksti Inteligjent</h3>
      <p className={styles.text}>
        AI e përshtat rezultatet dhe sugjerimet bazuar në kontekstin tënd personal dhe kolektiv.
      </p>
    </div>
  );
}

const styles = {
  box: css({
    padding: "5",
    background: "gray.50",
    borderRadius: "lg",
    boxShadow: "md",
    marginBottom: "6",
  }),
  heading: css({
    fontSize: "xl",
    fontWeight: "semibold",
    color: "blue.800",
    marginBottom: "2",
  }),
  text: css({
    fontSize: "md",
    color: "gray.600",
  }),
};
