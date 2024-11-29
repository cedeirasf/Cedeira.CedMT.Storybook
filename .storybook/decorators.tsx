import React from "react";
import { StoryContext, Decorator } from "@storybook/react";

// Función para obtener el tema actual desde el contexto
export function getTheme(context: StoryContext): "dark" | "light" {
  const backgrounds = context.parameters.backgrounds || {};
  return backgrounds.default === "dark" ? "dark" : "light";
}



export const withTheme: Decorator = (Story, context: StoryContext) => {
  const theme = context.globals.backgrounds?.value === "#1a202c" ? "dark" : "light";

  if (typeof window !== "undefined") {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }

  return <Story />;
};
