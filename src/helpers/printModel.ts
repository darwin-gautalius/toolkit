import { Model } from "openai/resources";

export function printModel(model: Model) {
  const extendedModel: any = model;
  const modelName = `model: ${model.id} ${extendedModel["provider"]} ${extendedModel["name"]}`;
  const border = "-".repeat(modelName.length);
  console.log(border);
  console.log(modelName);
  console.log(border);
  console.log("");
}
