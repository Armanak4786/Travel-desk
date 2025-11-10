const fs = require("fs");
const path = require("path");

// Directory where all your component files are stored
const COMPONENTS_DIR = path.join(
  "D:",
  "Workspace",
  "UDC",
  "SmartLender.Portal",
  "ValidationUIAPI",
  "UI",
  "projects"
);
const HTML_DIR = path.join(
  "D:",
  "Workspace",
  "UDC",
  "SmartLender.Portal",
  "ValidationUIAPI",
  "UI",
  "projects"
); // HTML files are usually in 'src/app'

// The imports you want to insert at the top of the file, before @Component
const imports = `
import {
  ToasterService,
  ValidationService,
} from 'auro-ui';
`;

// The methods you want to insert into each component file (excluding the constructor)
const methods = `
  pageCode: string = 'StandardQuoteComponent';
  modelName: string = ''; // Will be set dynamically

  async onFormReady(): Promise<void> {
    await this.updateValidation('onInit');
  }

  async onBlurEvent(event): Promise<void> {
    await this.updateValidation(event);
  }

  async onValueEvent(event): Promise<void> {
    await this.updateValidation(event);
  }

  async updateValidation(event) {
    const req = {
      form: this.mainForm?.form,
      formConfig: this.formConfig,
      event: event,
      modelName: this.modelName,
      pageCode: this.pageCode,
    };

    var responses: any = await this.validationSvc.updateValidation(req);
    if (responses.formConfig && !responses.status) {
      this.formConfig = { ...responses.formConfig };
      this.cdr.detectChanges();
    }
  }

  async onStepChange(quotesDetails: any): Promise<void> {
    if (quotesDetails.type !== 'tabNav') {
      var result: any = await this.updateValidation('onSubmit');

      if (!result?.status) {
        this.toasterSvc.showToaster({
          severity: 'error',
          detail: 'I7',
        });
      }
    }
  }
`;

// Function to get component selector from the component file
function getComponentSelector(componentFile) {
  const content = fs.readFileSync(componentFile, "utf8");
  const selectorMatch = content.match(/selector:\s*['"]([^'"]+)['"]/);
  if (selectorMatch && selectorMatch[1]) {
    return selectorMatch[1]; // Return the component's selector (e.g., 'app-payment-summary')
  }
  return null;
}

// Function to check if the selector is used in other HTML files
function getSelectorOccurrences(selector) {
  let count = 0;

  // Traverse HTML files in the project
  fs.readdirSync(HTML_DIR).forEach((file) => {
    const filePath = path.join(HTML_DIR, file);

    if (fs.statSync(filePath).isFile() && filePath.endsWith(".html")) {
      const htmlContent = fs.readFileSync(filePath, "utf8");
      if (htmlContent.includes(selector)) {
        count++;
      }
    }
  });

  return count; // Return the number of occurrences
}

// Function to insert imports and methods into a component file
function addImportsAndMethodsToComponent(componentFile) {
  let content = fs.readFileSync(componentFile, "utf8");
  const componentName = path.basename(componentFile, ".component.ts");
  const selector = getComponentSelector(componentFile);

  if (!selector) {
    return;
  }

  // Check for how many times the selector appears in the HTML files
  const occurrences = getSelectorOccurrences(selector);

  // Set pageCode and modelName based on occurrences
  let pageCode = componentName;
  let modelName = "";

  if (occurrences > 1) {
    modelName = pageCode; // If the selector appears in multiple HTML files, set modelName to pageCode
  } else if (occurrences < 1) {
    modelName = modelName; // If the selector appears in multiple HTML files, set modelName to pageCode
  } else {
    pageCode = componentName; // Otherwise, set pageCode to the component name
  }

  // Update the component's pageCode and modelName
  content = content.replace(
    /pageCode:\s*['"][^'"]*['"]/,
    `pageCode: '${pageCode}'`
  );
  content = content.replace(
    /modelName:\s*['"][^'"]*['"]/,
    `modelName: '${modelName}'`
  );

  // Check if imports are already included
  if (
    content.includes("ToasterService") &&
    content.includes("ValidationService")
  ) {
  } else {
    // Find the @Component decorator
    const componentDecoratorPosition = content.indexOf("@Component");

    if (componentDecoratorPosition !== -1) {
      // Insert imports before the @Component decorator
      content =
        content.slice(0, componentDecoratorPosition) +
        imports +
        content.slice(componentDecoratorPosition);
    }
  }

  // Check if the 'updateValidation' method already exists
  if (content.includes("async updateValidation(event)")) {
    return; // Skip inserting if method already exists
  }

  // If methods already exist in the component, don't insert them again
  if (content.includes("onFormReady") && content.includes("onBlurEvent")) {
    return;
  }

  // Find the place where methods should be inserted, typically after class definition
  const classPosition = content.indexOf("class");
  const insertionPosition = content.indexOf("{", classPosition) + 1;

  // Insert methods after the class definition
  const updatedContent =
    content.slice(0, insertionPosition) +
    methods +
    content.slice(insertionPosition);

  // Save the updated content back to the file
  fs.writeFileSync(componentFile, updatedContent);
}

// Function to traverse all component files and add imports and methods
function addImportsAndMethodsToAllComponents() {
  fs.readdirSync(COMPONENTS_DIR).forEach((file) => {
    const filePath = path.join(COMPONENTS_DIR, file);

    // Check if the file is a TypeScript file
    if (fs.statSync(filePath).isFile() && filePath.endsWith(".ts")) {
      addImportsAndMethodsToComponent(filePath);
    }
  });
}

// Run the script to add imports and methods
addImportsAndMethodsToAllComponents();
