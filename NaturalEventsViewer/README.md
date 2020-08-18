# Installation
1. Node.js: https://nodejs.org/en/
2. Run npm install in a project folder, and files shouldn't be occupied by any process (close Visual Studio or other editor)
3. Run npm run build:dev for development, it will compile the main and vendor bundles.
4. Run project in Visual Studio

# Modify WebPack vendor config
	If you modify the WebPack vendor config, you must manually recompile the vendor bundle.
	Type `npm run build:dev` to do this.