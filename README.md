# Getting Started with Create React App

## Menu API

The Express API uses SQLite and creates `api/data/menu.db` automatically. The schema contains a `menu` table with a foreign key `typeId` referencing `type.typeId`.

Start the API with:

```sh
npm run server
```

It listens on `http://localhost:5000`. The React development server proxies `/api` requests to it.

Available endpoints:

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/menu` | List menu items with their `typeName` |
| GET | `/api/menu?typeId=1` | Filter menu items by type |
| GET | `/api/menu/:menuId` | Get one menu item |
| POST | `/api/menu` | Create a menu item |
| PATCH | `/api/menu/:menuId` | Update menu item fields |
| DELETE | `/api/menu/:menuId` | Delete a menu item |
| GET | `/api/type` | List menu types |
| GET | `/api/type/:typeId` | Get one menu type |
| POST | `/api/type` | Create a menu type |
| PATCH | `/api/type/:typeId` | Rename a menu type |
| DELETE | `/api/type/:typeId` | Delete a type not used by menu items |

Create a menu item with JSON such as:

```json
{
  "name": "green tea",
  "price": 25,
  "isBestSeller": false,
  "typeId": 2
}
```

Run API tests with `npm run test:api`.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
