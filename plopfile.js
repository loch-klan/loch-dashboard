const requireField = (fieldName) => {
  return (value) => {
    if (String(value).length === 0) {
      return fieldName + " is required";
    }
    return true;
  };
};

module.exports = (plop) => {
  plop.setGenerator("component", {
    description: "Create a component",
    // User input prompts provided as arguments to the template
    prompts: [
      {
        // Raw text input
        type: "input",
        // Variable name for this input
        name: "name",
        // Prompt to display on command line
        message: "What is your component name?",
        validate: requireField("name"),
      },
    ],
    actions: [
      {
        // Add a new file
        type: "add",
        // Path for the new file
        path: "src/app/{{name}}/{{pascalCase name}}.js",
        // Handlebars template used to generate content of new file
        templateFile: "plop-templates/StatefulComponent.js.hbs",
      },
      {
        type: "add",
        path: "src/app/{{name}}/Api.js",
        templateFile: "plop-templates/Api.js.hbs",
      },
      {
        type: "add",
        path: "src/app/{{name}}/_utils/StatlessComponent.js",
        templateFile: "plop-templates/StatelessComponent.js.hbs",
      },
      {
        type: "add",
        path: "src/app/{{name}}/ActionTypes.js",
        templateFile: "plop-templates/ActionTypes.js.hbs",
      },
      {
        type: "add",
        path: "src/app/{{name}}/{{pascalCase name}}Action.js",
      },
      {
        type: "add",
        path: "src/app/{{name}}/{{pascalCase name}}Reducer.js",
        templateFile: "plop-templates/Reducer.js.hbs",
      },
      {
        type: "add",
        path: "src/app/{{name}}/index.js",
        templateFile: "plop-templates/index.js.hbs",
      },
      {
        type: "append",
        path: "src/reducers/RootReducer.js",
        pattern: `/* PLOP_INJECT_REDUCER_IMPORT */`,
        template: `import \{ {{pascalCase name}}Reducer } from '../app/{{name}}';`,
      },
      {
        type: "append",
        path: "src/reducers/RootReducer.js",
        pattern: `/* PLOP_INJECT_REDUCER */`,
        template: `\t{{pascalCase name}}State: {{pascalCase name}}Reducer,`,
      },
    ],
  });
};
