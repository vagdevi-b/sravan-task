# LIBRARY DEPLOYMENT STEPS

## STEPS IN LIBRARY:

<!-- 1. Update respective endpoint urls in the AppContant/environment file. -->
2. Run `npm i` to install all the dependencies for the library.
3. Run `ng build <library-name> --prod` in main folder.
4. Once dist folder created in main folder, run "npm pack" in `dist/<library-name>/`.
5. Step 4 will create `<library-name>-0.0.1.tgz` file in `dist/<library-name>/` folder.

## STEPS IN PARENT PROJECT:

1. Update respective endpoint urls in the AppContant/environment file.
2. Run `npm i` to install all the dependencies for the library.
3. Run the library specific command `npm i <path-to-library-dist>/<library-name>-0.0.1.tgz`.
4. Step3 will update if any new changes made in library package.
5. Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.
6. Copy the generated build files in `dist/<project-name>/` folder to nginx html server.
