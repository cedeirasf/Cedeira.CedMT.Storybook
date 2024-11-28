import type { Preview } from "@storybook/react";
import "../src/index.css"; // Importa Tailwind y estilos globales
/* import { withTheme } from "./decorators"; */
 

const preview: Preview = {
/*   decorators: [ withTheme ], */
  parameters: {
    backgrounds: {
      default: "light",
      toolbar: {
        icon: "circlehollow",
        items: ["light", "dark"],
        showName: true,
      },
      values: [
        { name: "light", value: "#F2F2FF" },
        { name: "dark", value: "#1a202c" },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
