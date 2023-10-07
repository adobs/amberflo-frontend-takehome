### Amberflo Frontend Take Home Challenge

## Table of Contents
1. [Running app locally on dev server](#running)
1. [Interfaces](#interfaces)
1. [Considerations and assumptions](#considerations)
1. [Future development ideas](#future)

## 1. <a name="running"></a>Running app locally on dev server
Assumes end user will have `git` and `npm`.

1. Clone this repo.
1. At directory root, add file called `.env`.  Add the following environment variable to the file: 
`REACT_APP_API_KEY=<API key>`.
1. In terminal at repo root, run `npm i` to install all dependencies.
1. Run `npm start` to run app in dev mode.
1. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 2. <a name="interfaces"></a>Interfaces

<b>Landing Page</b>
- View current meters
- Sortable tabular data
- Add new meters
- Delete meters (that were created by the user)
![Landing Page](/docs/images/Landing%20Page.png)

Double click on a meter to get the <b>Meter Details</b> page 
- Edit any fields of meter
- Delete meter
![Meter Details](/docs/images/Meter%20Details%20page.png)

After clicking delete meter button (through Landing Page or Meter Details page), see the <b>Delete Confirmation Modal</b>.
![Delete Modal](/docs/images/DeleteModal.png)

## 3. <a name="considerations"></a>Considerations / Assumptions
- API key security.  I chose to store the API key in an `.env` file for better security.  I didn't move the key to an `.env` file initially; there are a number of commits where the API key is in the repo.  There is still an additional threat to the API key security -- anything stores in `.env` file is publically available in the app's production build.  Instead of creating a backend proxy to call the API on behalf of the frontend, I just went with a `.env` file.  If you're curious to read more, check out this [link](https://create-react-app.dev/docs/adding-custom-environment-variables/#adding-development-environment-variables-in-env).
- Required API fields.  I assumed that the API could not accept any undefined / empty string values for required fields.  Iwas able to get an update / PUT operation to work where I changed a required param, `display_name` to be an empty string, and was able to sucessfully submit the PUT request and get back a response.  Ideally, the schema would be well defined, and I would be able to have better form validation / error handling in the frontend that would ensure the user is aware of what fields are actually required.  With a stricter schema, I would provide visual cues to the user if they're missing anything.
- Naming convention.  I typically strive to align my syntax and formatting with JavaScript standards.  But when the API named parameters with snake case, not camel case, I made the decision to have consistency over naming standards. I chose to keep my variable names as snake case as opposed to camel case to make actions such as object destructuring and request object formation easier, as well as create less opportunities for errors from having multiple naming conventions.

## 4. <a name="future"></a>Future Development Ideas
- Better form validation
- Implement testing (E2E, unit)
- Whitespace character trimming from inputs in forms
- Table pagination
- Export / download table capability
- Upload CSV into table capability
- Implement dark mode option 

