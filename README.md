# BuildQuote
 My ReactJS reflection for the Netmatters SCS training course.

## Setup
Check the releases for a quicker setup if you just want to check out the app.

## Debug Setup
**Note: This project can only be opened in Visual Studio 2022, as it uses the standalone React app template with an `.esproj` which won't work in older versions of VS. I might salvage it in the future, but for now: sorry!**

### Configuring properties
1. Open `BuildQuote.sln` in Visual Studio 2022.
2. Right click the `BuildQuote Server` project in the solution explorer and select `Properties`. Then navigate to `Debug > General > Open debug launch profiles UI`.
3. In the `BuildQuote Server` profile, ensure the `App URL` field is listed as `https://localhost:5001;http://localhost:5000`. You can use other ports, but you'll have to change the proxy address in `buildquote-app/src/setupProxy.js`. 
4. If you'd like to see the API documentation, tick the `Launch browser` checkbox, otherwise leave it unchecked.
5. Next, right click the `buildquote-app` project in the solution explorer and select `Properties`. Under `Debugging`, ensure that `Debugger to launch` is set to `launch.json`.
6. Now right click the solution itself and select `Properties` (last time, I promise). Under `Startup Project`, make sure `Multiple startup projects` is selected, and that `BuildQuote Server` is above `buildquote-app` on the list. The action for both should be `Start`.

### Installing packages
8. Depending on your Visual Studio settings, the backend's NuGet packages may already be installed. If not, go ahead and install them.
9. Next up is installing the frontend packages. Either open the `buildquote-app` folder in your preferred IDE or navigate to it via a CLI, and install the packages with npm or Yarn. There will be some vulnerabilities, but these are from the testing libraries and won't apply to production builds.

### Set up the database
10. Back in Visual Studio, open the package manager console and type `Update-Database`. This will make a SQL Server Express LocalDB called `BuildQuote` with some seeded data. If this doesn't work, ensure you have it installed (you can find out more about it [here](https://docs.microsoft.com/en-us/sql/database-engine/configure-windows/sql-server-express-localdb?view=sql-server-ver15)).

### You're done
11. Finally, it's ready. Click `Start` in Visual Studio. Two console windows will open, followed by the app (and the API documentation if you enabled it in step 4). Peruse it at your leisure.
