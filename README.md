# Cedeira.CeMT.Storybook <!--omit in toc-->

- [Cedeira.CeMT.Storybook ](#cedeiracemtstorybook-)
  - [Installacion y configuracion](#installacion-y-configuracion)
    - [Cofiguracion del registro privado](#cofiguracion-del-registro-privado)
  - [Configuración de la aplicación](#configuración-de-la-aplicación)
  - [Expanding the ESLint configuration](#expanding-the-eslint-configuration)

## Installacion y configuracion

Para instalar el paquete, ejecutar:

```bash
npm install @cedeirasf/cedmt-storybook
```

o

```bash
pnpm install @cedeirasf/cedmt-storybook
```

### Cofiguracion del registro privado

Es necesario configurar el registro privado en el entorno de desarrollo. Hay mas detalles de como hacerlo en la documentacion de GitHub [Working with the npm registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry), pero recomendamos que siga estos pasos:

- 1. Crear un token de acceso personal en GitHub. Es el mismo procedimiento explicado en [Como obtener el PAT del desarrollador con permisos para administrar paquetes?](https://github.com/cedeirasf/Cedeira.CedMT.Documentacion/tree/main/flujos-de-trabajo/flujo-de-trabajo-de-desarrollo#como-obtener-el-pat-del-desarrollador-con-permisos-para-administrar-paquetes).

- 2. Crear un archivo `.npmrc` en el directorio raíz del proyecto, con el siguiente contenido:

```bash
# This is a comment
@cedeirasf:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

- 3. Reemplazar el contenido del archivo `.npmrc` con el token de acceso personal que acabas de crear, por ejemplo usando el siguiente comando donde `YOUR_GITHUB_TOKEN` es la frase dentro del archivo `.npmrc` que se remplazara por tu toquen:

```bash
sed -i 's/YOUR_GITHUB_TOKEN/ghp_Oy3YEhkmUMpXXE8UFpKr02R9UT5Y00zD4j4r/g' .npmrc
```

El archivo se verá así:


```bash
# This is a comment
@cedeirasf:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=ghp_Oy3YEhkmUMpXXE8UFpKr02R9UT5Y00zD4j4r
```

- 4. Agregar el archivo `.npmrc` a la lista de archivos ignorados en GitHub.

> [!IMPORTANT]
> El archivo `.npmrc` contiene un token de acceso personal, por lo que es importante que no se publique en el repositorio.

## Configuración de la aplicación

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
