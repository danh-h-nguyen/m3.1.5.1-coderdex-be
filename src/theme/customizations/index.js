import Link from "./Link";

function customizeComponents(theme) {
  return { ...Link(theme) };
}

export default customizeComponents;
